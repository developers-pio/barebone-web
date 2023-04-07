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
          class="customProfile"
          fill="outline"
          v-model="searchedEvent"
          debounce="500"
          @ion-input="searchEvents(true)"
        ></ion-input>
      </div>
      <IonCard class="events-container d-flex flex-column">
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
            <ion-spinner v-if="page < totalPages" color="medium" class="load-more-events" style="margin: 10px auto;"></ion-spinner>
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
  IonSpinner,
} from "@ionic/vue";
import { optionsOutline  } from "ionicons/icons";
import HeaderComponent from "@/components/header.vue";
import EventComponent from "@/components/event.vue";
import { RecycleScroller } from "vue-virtual-scroller";
import { secureStorage, observeElement, presentToast } from "@/services/utils.js";
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
    IonSpinner,
    RecycleScroller,
  },
  data() {
    return {
      optionsOutline,
      allEvents: [],
      errorText: null,
      searchedEvent:'',
      latitude:null,
      longitude:null,
      totalPages:0,
      page: 0,
    };
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          // Call the function to search for events
          this.searchEvents(true);
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
    async searchEvents(reset=false) {
      if(reset){
        this.page=0
      }
      if (
        Intl.DateTimeFormat().resolvedOptions().timeZone.includes("America")
      ) {
        this.errorText = null;
        const ticketMaster = await this.getTicketMasterData();
        if(reset){
          this.allEvents = ticketMaster
          observeElement(document.querySelector('.load-more-events'), this.isObserverIntersecting)
        }else{
          this.allEvents = [...this.allEvents, ...ticketMaster];
        }
      } else {
        this.errorText = "No Event Available for the Location.";
      }
    },
    async getTicketMasterData() {
      const query = new URLSearchParams({
        apikey: "02CT2Qgtn6XAEQwCqsPb2Hd7yXQZx19H",
        latlong: `${this.latitude},${this.longitude}`,
        page: this.page,
        sort: "name,asc",
        locale: "*",
        keyword: this.searchedEvent
      });

      const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${query}`;
      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          let events = [];
          const savedEvents = secureStorage().getItem('events')
          if(savedEvents && savedEvents.calenderEvents && savedEvents.rejectedEvents){
            data._embedded.events.forEach(ev=>{
              const eventInCalender = savedEvents.calenderEvents.some(event=>event.id===ev.id)
              if(!eventInCalender){
                const eventRejected = savedEvents.rejectedEvents.some(event=>event.id===ev.id)
                if(!eventRejected){
                  events.push(ev)
                }
              }
            })
          }else{
            events=data._embedded.events
          }
          this.totalPages = data.page.totalPages
          return events;
        })
        .catch((error) => console.error(error));
    },
    rejectEvent(event) {
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
      presentToast("top", "Event Rejected", "danger");
      secureStorage().setItem("events", events);
    },
    addToCalender(event) {
      this.allEvents= this.allEvents.filter(ev=>ev.id!==event.id)
      let events = secureStorage().getItem("events");
      if (events) {
        events.calenderEvents.push({
          id: event.id,
          app: "ticketmaster",
          title: event.name,
          url: event.url,
          start: event?.dates?.start || {},
          end: event?.dates?.end || {}
        });
        secureStorage().setItem("events", events);
      } else {
        events = {
          rejectedEvents: [],
          calenderEvents: [
            {
              id: event.id,
              app: "ticketmaster",
              title: event.name,
              url: event.url,
              start: event?.dates?.start || {},
              end: event?.dates?.end || {}
            },
          ],
        };
      }
      presentToast("top", "Event Added to Calender", "success");
      secureStorage().setItem("events", events);
    },
    isObserverIntersecting(entry){
      if(entry.isIntersecting){
        this.page++
        this.searchEvents()
      }
    }
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
