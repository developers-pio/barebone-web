<template>
  <ion-card button @click="$router.push(`/event/${event.id}`)">
    <div
      class="event-image-container"
      :style="`background-image: url('${event.images[0].url}')`"
    >
      <div class="event-name-container ion-padding ion-justify-content-between">
        <div class="d-flex flex-column">
          <h3 class="ion-no-margin">{{ event.name }}</h3>
          <div
            class="d-flex"
            v-for="(classification, index) in event.classifications"
            :key="`classification-${index}`"
          >
            <ion-chip
              v-if="
                classification.segment &&
                classification.segment.name != 'Undefined'
              "
              >{{ classification.segment.name }}</ion-chip
            >
            <ion-chip
              v-if="
                classification.genere &&
                classification.genere.name != 'Undefined'
              "
              >{{ classification.genre.name }}</ion-chip
            >
            <ion-chip
              v-if="
                classification.subGenre &&
                classification.subGenre.name != 'Undefined'
              "
              >{{ classification.subGenre.name }}</ion-chip
            >
            <ion-chip
              v-if="
                classification.type && classification.type.name != 'Undefined'
              "
              >{{ classification.type.name }}</ion-chip
            >
            <ion-chip
              v-if="
                classification.subType &&
                classification.subType.name != 'Undefined'
              "
              >{{ classification.subType.name }}</ion-chip
            >
          </div>
        </div>
        <div class="d-flex flex-column">
          <div>{{ event.distance }} {{ event.units }}</div>
          <div>{{ getDate(event.dates.start.dateTime) }}</div>
          <ion-chip style="width:fit-content;"
              >TicketMaster</ion-chip
            >
        </div>
      </div>
    </div>
  </ion-card>
</template>

<script>
import { IonCard, IonChip,createAnimation, createGesture, } from "@ionic/vue";
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
    IonChip,
  },
  mounted(){
    const windowWidth = window.innerWidth
    const itemElement = this.$el.childNodes[0]

            const deleteAnimation = createAnimation()
                .addElement(this.$el)
                .duration(200)
                .easing('ease-out')
                .fromTo('height', '416px', 0)

            const swipeGesture = createGesture({
                el: itemElement,
                threshold: 15,
                direction: 'x',
                gestureName: 'swipe-dismiss',
                onMove: (ev) => {
                    // Reposition card
                    itemElement.style.transform = `translateX(${ev.deltaX}px)`
                },
                onEnd: (ev) => {
                    console.log(ev)
                    itemElement.style.transition = '0.2s ease-out'

                    // Fly out the card if we cross the threshold of 150px
                    if (ev.deltaX < -150) {
                        itemElement.style.transform = `translate3d(-${windowWidth}px, 0, 0)`

                        deleteAnimation.play()

                        deleteAnimation.onFinish(async () => {
                            this.$el.style.display = 'none'
                            this.$emit('reject-event',this.event)

                            // Finish code to completely remove from your state
                        })
                    } 
                    if (ev.deltaX > 150) {
                        itemElement.style.transform = `translate3d(${windowWidth}px, 0, 0)`

                        deleteAnimation.play()

                        deleteAnimation.onFinish(async () => {
                            this.$el.style.display = 'none'
                            this.$emit('add-to-calender',this.event)
                        })
                    } 
                    else {
                        // Fly back to original position
                        itemElement.style.transform = ''
                    }
                },
            })

            swipeGesture.enable()
        },
  methods: {
    getDate(val) {
      const dateObject = new Date(val);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        year: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter.format(dateObject);

      return formattedDate;
    },
  },
};
</script>

<style scoped>
.event-image-container {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-name-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  gap: 10px;
}
.event-name-container h3 {
  color: var(--ion-color-warning);
}

.event-name-container ion-chip {
  --background: var(--ion-color-light);
  --color: var(--ion-color-dark);
}
</style>