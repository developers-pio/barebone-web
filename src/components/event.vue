<template>
  <ion-card
    button
    @click="$router.push(`/event/${event.id}`)"
    style="margin: 0px 5px; border-radius: 25px"
  >
    <div
      class="event-image-container"
      :style="`background-image: url('${getImage(event)}')`"
    >
      <div class="event-name-container ion-justify-content-between ion-padding">
        <div class="d-flex flex-column">
          <h4 class="ion-no-margin">{{ event.name }}</h4>
          <!-- <div
            class="d-flex"
            v-for="(classification, index) in event.classifications"
            :key="`classification-${index}`"
          >
            <ion-chip class="ellipsis-1"
              v-if="
                classification.segment &&
                classification.segment.name != 'Undefined'
              "
              >{{ classification.segment.name }}</ion-chip
            >
            <ion-chip class="ellipsis-1"
              v-if="
                classification.genere &&
                classification.genere.name != 'Undefined'
              "
              >{{ classification.genre.name }}</ion-chip
            >
            <ion-chip class="ellipsis-1"
              v-if="
                classification.subGenre &&
                classification.subGenre.name != 'Undefined'
              "
              >{{ classification.subGenre.name }}</ion-chip
            >
            <ion-chip class="ellipsis-1"
              v-if="
                classification.type && classification.type.name != 'Undefined'
              "
              >{{ classification.type.name }}</ion-chip
            >
            <ion-chip class="ellipsis-1"
              v-if="
                classification.subType &&
                classification.subType.name != 'Undefined'
              "
              >{{ classification.subType.name }}</ion-chip
            >
          </div> -->
          <div class="venue">{{ getVenue(event || []) }}</div>
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
export default {
  name: "EventComponent",
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  components: {
    IonCard,
  },
  mounted() {
    const windowWidth = window.innerWidth;
    const itemElement = this.$el.childNodes[0];

    const deleteAnimation = createAnimation()
      .addElement(this.$el)
      .duration(100)
      .easing("ease-out")
      .fromTo("width", "100%", 0);

    const swipeGesture = createGesture({
      el: itemElement,
      threshold: 15,
      direction: "x",
      gestureName: "swipe-dismiss",
      onMove: (ev) => {
        itemElement.style.transform = `translateX(${ev.deltaX}px)`;
      },
      onEnd: (ev) => {
        itemElement.style.transition = "0.2s ease-out";

        // Fly out the card if we cross the threshold of 150px
        if (ev.deltaX < -150) {
          itemElement.style.transform = `translate3d(-${windowWidth}px, 0, 0)`;

          deleteAnimation.play();

          deleteAnimation.onFinish(async () => {
            this.$el.style.display = "none";
            this.$emit("reject-event", this.event);
          });
        }
        if (ev.deltaX > 150) {
          itemElement.style.transform = `translate3d(${windowWidth}px, 0, 0)`;

          deleteAnimation.play();

          deleteAnimation.onFinish(async () => {
            this.$el.style.display = "none";
            this.$emit("add-to-calender", this.event);
          });
        } else {
          // Fly back to original position
          itemElement.style.transform = "";
        }
      },
    });
    swipeGesture.enable();
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
      console.log(val)
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
  height: 500px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-name-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
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
