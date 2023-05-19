<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">Calender</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
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
    </ion-content>
    <footer-component />
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonTitle } from "@ionic/vue";
import FooterComponent from "@/components/footer.vue";
import { secureStorage } from "@/services/utils";
export default {
  name: "ProfilePage",
  components: {
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader, 
    IonToolbar, 
    IonTitle,
    FooterComponent
  },
  data() {
    return {
      calenderEvents: [],
    };
  },
  mounted() {
    const events = secureStorage().getItem("events");
    if (events && events.calenderEvents) {
      const calendersEvent = events.calenderEvents;
      this.calenderEvents = calendersEvent.sort((a, b) => {
        const aDate = a.date.split("-")[0];
        const bDate = b.date.split("-")[0];
        return new Date(aDate) - new Date(bDate);
      });
    }
  },
};
</script>
