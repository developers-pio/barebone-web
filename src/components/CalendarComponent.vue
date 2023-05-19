<template>
  <ion-grid>
    <ion-row>
      <ion-col
        size="12"
        size-md="6"
        size-lg="4"
        size-xl="3"
        v-for="event in calenderEvents || []"
        :key="event.id"
        class="ion-padding-bottom"
        style="box-shadow: none"
      >
        <div
          button
          @click="$router.push(`/event/${event.id}`)"
          class="ion-no-margin"
        >
          <div
            class="event-image-container"
            :style="`background-image: url('${event.image_url}')`"
          >
            <div
              class="event-name-container ion-justify-content-between ion-padding"
            >
              <div class="d-flex flex-column">
                <h4 class="ion-no-margin">{{ event.title }}</h4>
                <div class="venue">{{ event.venue }}</div>
                <div class="date">{{ event.date }}</div>
                <div class="time">{{ event.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { IonGrid, IonRow, IonCol } from "@ionic/vue";
import { secureStorage } from "@/services/utils";
export default {
  data() {
    return {
      calenderEvents: [],
    };
  },
  components: {
    IonGrid,
    IonRow,
    IonCol,
  },
  mounted() {
    const events = secureStorage().getItem("events");
    if (events && events.calenderEvents) {
      const calendersEvent= events.calenderEvents
      this.calenderEvents = calendersEvent.sort((a,b)=>{
        const aDate = a.date.split('-')[0]
        const bDate = b.date.split('-')[0]
        return new Date(aDate) - new Date(bDate)
      })
    }
  },

  name: "CalenderPage",
};
</script>

<style scoped>
.event-image-container {
  height: 200px;
  border-radius: 25px;
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
  gap: 5px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}
.event-name-container h4 {
  color: var(--ion-color-light);
  margin-bottom: 5px;
  font-size: 15px;
}

.event-image-container .venue,
.event-image-container .date,
.event-image-container .time {
  margin-bottom: 2px;
  font-size: 12px;
}

.event-name-container ion-chip {
  --background: var(--ion-color-light);
  --color: var(--ion-color-dark);
}
</style>
