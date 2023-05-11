<template>
  <ion-card
    button
    @click="$router.push(`/event/${event.id}`)"
    class="ion-no-margin"
  >
    <div
      class="event-image-container"
      :style="`background-image: url('${getImage(event)}')`"
    >
      <div class="event-name-container ion-justify-content-between ion-padding">
        <div class="d-flex flex-column">
          <h4 class="ion-no-margin">{{ event.name }}</h4>
          <div class="venue">{{ getVenue(event) }}</div>
          <div class="date">{{ getDate(event.dates) }}</div>
          <div class="time">{{ getTime(event.dates) }}</div>
          <div v-if="event.distance">
            {{ event.distance }} {{ event.units }}
          </div>
        </div>
      </div>
    </div>
  </ion-card>
</template>

<script>
import { IonCard, createAnimation, createGesture } from "@ionic/vue";
import {mapState} from 'pinia'
import {eventStore} from '../stores/eventStore'
export default {
  name: "EventComponent",
  props: {
    event: {
      type: Object,
      required: true,
    },
    eventsListLength:{
      type: Number,
      required:true
    }
  },
  components: {
    IonCard,
  },
  computed: {
    ...mapState(eventStore, ["menu","currentEventIndex"]),
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
          itemElement.style.transform = `translate3d(${windowWidth}px, 0, 0)`;

          deleteXAnimation.play();

          deleteXAnimation.onFinish(async () => {
            this.$el.style.display = "none";
            this.$emit("add-to-calender", this.event);
          });
        } else {
          // Fly back to original position
          itemElement.style.transform = "";
        }
      },
    })
    swipeXGesture.enable()

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
          if (ev.deltaY < -50 && this.currentEventIndex!==this.eventsListLength-1) {
            itemElement.style.transform = `translate3d(0, -${windowHeight}px, 0)`;

            deleteYAnimation.play();

            deleteYAnimation.onFinish(async () => {
              
                this.$el.style.display = "none";
                this.$emit("next-card");
            });
          }
        if (ev.deltaY > 50 && this.currentEventIndex!==0) {
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
    })
    swipeYGesture.enable()
  },
  methods: {
    getDate(dates) {
      let date = "";
      if (dates.start && (dates.start.dateTime || dates.start.localDate)) {
        date += this.dConvert(dates.start.dateTime || dates.start.localDate);
      }
      if (dates.end && (dates.end.dateTime || dates.end.localDate)) {
        date += `- ${this.dConvert(dates.end.dateTime || dates.end.localDate)}`;
      }
      return date;
    },
    getTime(dates) {
      let date = "";
      if (dates.start && dates.start.localTime) {
        date += this.tConvert(dates.start.localTime);
      }
      if (dates.end && dates.end.localTime) {
        date += `- ${this.tConvert(dates.end.localTime)}`;
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
    getVenue(event) {
      const venue = event?._embedded?.venues?.[0] || {};
      let address = "";
      if (venue.name) {
        address += `${venue.name}`;
      }
      if (venue.state) {
        address += `, ${venue.state.name}`;
      }
      if (venue.country) {
        address += `, ${venue.country.countryCode}`;
      }
      return address;
    },
    tConvert(time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join(""); // return adjusted time or original string
    },
    getImage(event) {
      const image = event.images
        ? event.images.reduce((prev, current) => {
            const prevResolution = prev.width * prev.height;
            const currentResolution = current.width * current.height;

            return currentResolution > prevResolution ? current : prev;
          })
        : {};
      return image?.url || "";
    },
  },
};
</script>

<style scoped>
.event-image-container {
  height: calc(100vh - 62px);
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-name-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.01);
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
