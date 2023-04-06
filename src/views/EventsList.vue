<template>
  <ion-page>
    <header-component />
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="d-flex ion-justify-content-between">
        <ion-icon
          aria-hidden="true"
          :ios="optionsOutline"
          :md="optionsOutline"
          color="primary"
          size="large"
        ></ion-icon>
        <ion-input
          style="max-width: 300px"
          label=""
          placeholder="Search Events"
        ></ion-input>
      </div>
      <IonCard>
        <h2 class="ion-margin ion-margin-vertical" v-if="errorText">
          {{ errorText }}
        </h2>
        <template v-else>
          <RecycleScroller
            class="ion-content-scroll-host scroller"
            :items="allEvents"
            :item-size="416"
            key-field="id"
            v-slot="{ item, index }"
          >
            <EventComponent
              @reject-event="rejectEvent($event, index)"
              @add-to-calender="addToCalender($event, index)"
              :event="item"
              class="ion-padding-bottom"
            />
          </RecycleScroller>
        </template>
      </IonCard>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonInput,
  IonCard,
} from "@ionic/vue";
import { optionsOutline } from "ionicons/icons";
import HeaderComponent from "@/components/header.vue";
import EventComponent from "@/components/event.vue";
import { RecycleScroller } from "vue-virtual-scroller";
import { secureStorage } from "@/services/utils.js";
export default {
  name: "EventsList",
  components: {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonInput,
    HeaderComponent,
    EventComponent,
    IonCard,
    RecycleScroller,
  },
  data() {
    return {
      optionsOutline,
      allEvents: [],
      errorText: null,
      page: 0,
    };
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(lat, lng);
          // Call the function to search for events
          this.searchEvents(lat, lng);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  },
  methods: {
    async searchEvents(lat, lng) {
      if (
        Intl.DateTimeFormat().resolvedOptions().timeZone.includes("America")
      ) {
        this.errorText = null;
        const ticketMaster = await this.getTicketMasterData(lat, lng);
        this.allEvents = [...this.allEvents, ...ticketMaster];
      } else {
        this.errorText = "No Event Available for the Location.";
      }
    },
    async getTicketMasterData(lat, lng) {
      const query = new URLSearchParams({
        apikey: "02CT2Qgtn6XAEQwCqsPb2Hd7yXQZx19H",
        latlong: `${lat},${lng}`,
        page: 0,
        sort: "name,asc",
        locale: "*",
      });

      const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${query}`;
      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const events = data._embedded.events;
          return events;
        })
        .catch((error) => console.error(error));
    },
    rejectEvent(event, index) {
      console.log(event,index)
      // this.allEvents.splice(index, 1)
      this.allEvents= this.allEvents.filter(ev=>ev.id!==event.id)
      let events = secureStorage().getItem("events");
      if (events) {
        events.rejectedEvents.push({ id: event.id, app: "ticketmaster" });
      } else {
        events = {
          rejectedEvents: [{ id: event.id, app: "ticketmaster" }],
          calenderEvents: [],
        };
      }
      secureStorage().setItem("events", events);
    },
    addToCalender(event, index) {
      console.log(event,index)
      this.allEvents= this.allEvents.filter(ev=>ev.id!==event.id)
      let events = secureStorage().getItem("events");
      if (events) {
        events.calenderEvents.push({
          id: event.id,
          app: "ticketmaster",
          name: event.name,
          url: event.url,
        });
        secureStorage().setItem("events", events);
      } else {
        events = {
          rejectedEvents: [],
          calenderEvents: [
            {
              id: event.id,
              app: "ticketmaster",
              name: event.name,
              url: event.url,
            },
          ],
        };
      }
      secureStorage().setItem("events", events);
    },
  },
};
</script>
<style>
.scroller {
  height: 100%;
}
.vue-recycle-scroller__item-view {
  padding: 10px 0px;
}
</style>
