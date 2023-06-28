<template>
  <ion-card button @click="$router.push(`/event/${event.from}/${event.id}`)" class="ion-no-margin">
    <div class="event-image-container" :style="`background-image: url('${event.image_url ? event.image_url : '/img/event.jpg'
      }')`">
      <div class="event-name-container ion-justify-content-between ion-padding">
        <div class="d-flex flex-column">
          <h4 class="ion-no-margin">{{ event.title }}</h4>
          <div class="venue">{{ getVenue(event.venue) }}</div>
          <div class="date">{{ getDate(event.startDate, event.endDate) }}</div>
          <div class="time">{{ getTime(event.startDate, event.endDate) }}</div>
          <div>
            {{ getDistance(event.latitude, event.longitude) }}
          </div>
        </div>
        <div class="d-flex ion-align-items-center">
          <copy-modal :event-object="event" />
        </div>
      </div>
    </div>
  </ion-card>
</template>

<script>
import { IonCard, createAnimation, createGesture } from "@ionic/vue";
import { mapState } from "pinia";
import { eventStore } from "../stores/eventStore";
import copyModal from "@/components/copyModal.vue";
import { secureStorage, presentToast } from "@/services/utils";
export default {
  name: "EventComponent",
  props: {
    event: {
      type: Object,
      required: true,
    },
    eventsListLength: {
      type: Number,
      required: true,
    },
  },
  components: {
    IonCard,
    copyModal,
  },
  computed: {
    ...mapState(eventStore, ["currentEventIndex", "filter", "geoLocation"]),
  },
  mounted() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const itemElement = this.$el.childNodes[0];

    const deleteXAnimation = createAnimation()
      .addElement(this.$el)
      .duration(100)
      .easing("ease-out")
      .fromTo("width", "100%", 0);

    const deleteYAnimation = createAnimation()
      .addElement(this.$el)
      .duration(100)
      .easing("ease-out")
      .fromTo("height", "100%", 0);

    const swipeXGesture = createGesture({
      el: itemElement,
      threshold: 15,
      direction: "x",
      gestureName: "swipe-dismiss",
      gesturePriority: 1,
      onMove: (ev) => {
        itemElement.style.transform = `translateX(${ev.deltaX}px)`;
      },
      onEnd: (ev) => {
        itemElement.style.transition = "0.2s ease-out";

        // Fly out the card if we cross the threshold of 150px
        if (ev.deltaX < -150) {
          itemElement.style.transform = `translate3d(-${windowWidth}px, 0, 0)`;

          deleteXAnimation.play();

          deleteXAnimation.onFinish(async () => {
            this.$el.style.display = "none";
            this.$emit("reject-event", this.event);
          });
        }
        if (ev.deltaX > 150) {
          const calenderEvent = {
            calendarId: "primary",
            resource: {
              summary: this.event.title,
              description: this.event.description,
              start: {
                dateTime: new Date(this.event.startDate).toISOString(),
                // timeZone:'GMT-04:00'
              },
              end: {
                dateTime: this.event.endDate ? new Date(this.event.endDate).toISOString() :
                  this.getEndDate(this.event.startDate).toISOString()
              },
              source: {
                url: location.origin + `/event/${this.event.from}/${this.event.id}`
              },
              extendedProperties: {
                shared: {
                  eventImage: this.event.image_url,
                  eventUrlSlug: `/event/${this.event.from}/${this.event.id}`,
                  originalEventSource: this.event.url,
                  venue: this.getVenue(this.event.venue)
                }
              }
            },
          };
          const events = secureStorage().getItem("events");
          console.log(events?.calenderEvents)
          const conditionOne = (events?.calenderEvents || []).some(
            (event) => event.id === this.event.id && event.from === this.event.from
          );
          if (conditionOne) {
            presentToast("top", "Event already added to calendar", "danger");
            itemElement.style.transform = "";
          } else {
            if (window.gapi.client.getToken() === null) {
              this.$emit("no-authtication-found", calenderEvent);
              itemElement.style.transform = "";
            } else {
              itemElement.style.transform = `translate3d(${windowWidth}px, 0, 0)`;

              deleteXAnimation.play();

              deleteXAnimation.onFinish(async () => {
                // console.log(this.event);

                window.gapi.client.calendar.events.insert(
                  calenderEvent
                ).then(() => {
                  // console.log(res)
                  this.$el.style.display = "none";
                  this.$emit("add-to-calender", this.event);
                }).catch(error => {
                  console.log(error)
                  itemElement.style.transform = "";
                })

              });
            }
          }

        } else {
          // Fly back to original position
          itemElement.style.transform = "";
        }
      },
    });
    swipeXGesture.enable();

    const swipeYGesture = createGesture({
      el: itemElement,
      threshold: 15,
      direction: "y",
      gesturePriority: 0,
      gestureName: "pull-up",
      onMove: (ev) => {
        itemElement.style.transform = `translateY(${ev.deltaY}px)`;
      },
      onEnd: (ev) => {
        itemElement.style.transition = "0.2s ease-out";
        // Fly out the card if we cross the threshold of 150px
        if (
          ev.deltaY < -50 &&
          this.currentEventIndex !== this.eventsListLength - 1
        ) {
          itemElement.style.transform = `translate3d(0, -${windowHeight}px, 0)`;

          deleteYAnimation.play();

          deleteYAnimation.onFinish(async () => {
            this.$el.style.display = "none";
            this.$emit("next-card");
          });
        }
        if (ev.deltaY > 50 && this.currentEventIndex !== 0) {
          itemElement.style.transform = `translate3d(0, ${windowHeight}px, 0)`;

          deleteYAnimation.play();

          deleteYAnimation.onFinish(async () => {
            // this.$emit("add-to-calender", this.event);
            this.$el.style.display = "none";
            this.$emit("previous-card");
          });
        } else {
          // Fly back to original position
          itemElement.style.transform = "";
        }
      },
    });
    swipeYGesture.enable();
  },
  methods: {
    getEndDate(startDate) {
      const date = new Date(startDate);
      date.setHours(23, 59, 59, 999)
      return date;
    },
    getDate(startDate, endDate) {
      let date = "";
      if (startDate) {
        date += this.dConvert(startDate);
      }
      if (endDate) {
        date += ` - ${this.dConvert(endDate)}`;
      }
      return date;
    },
    getTime(startTime, endTime) {
      let date = "";
      if (startTime) {
        date += this.tConvert(startTime);
      }
      if (endTime) {
        date += ` - ${this.tConvert(endTime)}`;
      }
      return date;
    },
    dConvert(val) {
      const dateObject = new Date(val);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter.format(dateObject);
      return formattedDate;
    },
    getVenue(venue) {
      if (venue.display_address) {
        return venue.display_address.join(", ");
      }
      let address = [];
      if (venue.address && venue.address.line1) {
        address.push(venue.address.line1);
      }
      if (venue.name) {
        address.push(venue.name);
      }
      if (venue.state || venue.city) {
        address.push(venue?.state?.name || venue?.city?.name || venue.city);
      }
      if (venue.country) {
        address.push(venue?.country?.countryCode || venue?.country);
      }
      return address.join(", ");
    },
    tConvert(time) {
      const datetime = new Date(time); // Replace with your datetime value

      const timeString = datetime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        hour12: true,
      });

      return timeString;
    },
    calculateDistance(lat, lon) {
      const earthRadius = 6371; // Radius of the Earth in kilometers

      // Convert latitude and longitude from degrees to radians
      const latRad1 = this.toRadians(this.geoLocation.latitude);
      const lonRad1 = this.toRadians(this.geoLocation.longitude);
      const latRad2 = this.toRadians(lat);
      const lonRad2 = this.toRadians(lon);

      // Calculate the differences between the latitudes and longitudes
      const latDiff = latRad2 - latRad1;
      const lonDiff = lonRad2 - lonRad1;

      // Apply the Haversine formula
      const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(latRad1) *
        Math.cos(latRad2) *
        Math.sin(lonDiff / 2) *
        Math.sin(lonDiff / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Calculate the distance
      const distance = earthRadius * c;

      return distance;
    },
    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    },
    getDistance(lat, lng) {
      if (lat && lng) {
        const distance = this.calculateDistance(lat, lng);
        if (this.filter.unit === "km") {
          return distance.toFixed(2) + " km";
        } else {
          return (Number(distance) * 0.621371).toFixed(2) + " mi";
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.event-image-container {
  height: calc(100dvh - 62px);
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-name-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  gap: 10px;
}

.event-name-container h4 {
  color: var(--ion-color-light);
  margin-bottom: 10px;
}

.event-image-container .venue,
.event-image-container .date,
.event-image-container .time {
  margin-bottom: 5px;
}

.event-name-container ion-chip {
  --background: var(--ion-color-light);
  --color: var(--ion-color-dark);
}
</style>
