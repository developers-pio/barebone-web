<template>
  <ion-page>
    <ion-header class="ion-border event-list-header-search">
      <div class="d-flex ion-justify-content-between ion-align-items-center">
        <ion-menu-button
          :auto-hide="false"
          menu="main-menu"
          color="primary"
        >
          <ion-icon
            aria-hidden="true"
            :ios="optionsOutline"
            :md="optionsOutline"
            color="light"
            size="large"
          ></ion-icon>
        </ion-menu-button>
        <ion-input v-show="showSearch"
          style="max-width: 300px"
          label=""
          placeholder="Search Events"
          class="customProfile ion-margin-end"
          fill="outline"
          v-model="searchedEvent"
          debounce="500"
          @ion-input="searchEvents(true)"
        ></ion-input>
        <ion-icon
            @click="showSearch = !showSearch"
            :ios="searchOutline"
            :md="searchOutline"
            color="light"
            size="large"
            style="margin-right:10px"
          ></ion-icon>
      </div>
    </ion-header>
    <ion-content
      :fullscreen="true"
    >
      <IonCard
        class="d-flex flex-column ion-no-margin"
      >
        <h2 class="ion-margin ion-margin-vertical" v-if="errorText">
          {{ errorText }}
        </h2>
        <template v-else>
            <EventComponent
              v-if="allEvents.length > 0"
              :class="currentClass"
              :key="`event-${currentEventIndex}`"
              @reject-event="rejectEvent($event, index)"
              @add-to-calender="addToCalender($event, index)"
              @next-card="setNextCard"
              @previous-card="setPreviousCard"
              :event="allEvents[this.currentEventIndex]"
              :events-list-length="allEvents.length"
            />
        </template>
      </IonCard>
    </ion-content>
    <footer-component />
  </ion-page>
</template>

<script>
import {
  IonHeader,
  IonContent,
  IonPage,
  IonIcon,
  IonInput,
  IonCard,
  IonMenuButton,
} from "@ionic/vue";
import { optionsOutline, searchOutline } from "ionicons/icons";
import FooterComponent from "@/components/footer.vue";
import EventComponent from "@/components/event.vue";
import {
  secureStorage,
  presentToast,
} from "@/services/utils.js";
import { mapActions, mapState } from "pinia";
import { eventStore } from "@/stores/eventStore";
export default {
  name: "EventsList",
  components: {
    IonContent,
    IonPage,
    IonIcon,
    IonInput,
    EventComponent,
    IonCard,
    IonMenuButton,
    FooterComponent,
    IonHeader
  },
  data() {
    return {
      optionsOutline,
      searchOutline,
      allEvents: [],
      errorText: null,
      searchedEvent: "",
      latitude: null,
      longitude: null,
      page: 0,
      showSearch: false,
      currentClass:'from-bottom'
    };
  },
  computed: {
    ...mapState(eventStore, [ "filter","currentEventIndex","totalPages"]),
  },
  watch: {
    filter: {
      handler() {
        this.searchEvents(true);
      },
      deep: true,
    },
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
        () => {
          this.errorText =
            "Please allow Location Permission for better results.";
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  },
  methods: {
    ...mapActions(eventStore, ["setCurrentIndex","setTotalPages"]),
    async searchEvents(reset = false) {
      if (
        this.errorText &&
        this.errorText ===
          "Please allow Location Permission for better results."
      ) {
        return;
      }
      if (reset) {
        this.page=0
      }
      // if (
      //   Intl.DateTimeFormat().resolvedOptions().timeZone.includes("America")
      // ) {
      this.errorText = null;
      const ticketMaster = await this.getTicketMasterData();
      if (ticketMaster.length === 0) {
        this.allEvents = [];
        this.errorText = "No Event Available.";
      } else if (reset) {
        this.allEvents = ticketMaster;
      } else {
        this.allEvents = [...this.allEvents, ...ticketMaster];
      }
      if(reset){
        this.setCurrentIndex(0)
      }
      // } else {
      //   this.allEvents=[]
      //   this.errorText = "No Event Available for the Location.";
      // }
    },
    async getTicketMasterData() {
      const query = new URLSearchParams({
        apikey: "02CT2Qgtn6XAEQwCqsPb2Hd7yXQZx19H",
        latlong: `${this.latitude},${this.longitude}`,
        page: this.page,
        locale: "*",
        sort:'date,asc',
        keyword: this.searchedEvent,
        ...{
          radius: this.filter.radius || "",
          units: this.filter.unit || "",
          startDateTime: this.filter.startDateTime
            ? this.filter.startDateTime + "Z"
            : "",
          endDateTime: this.filter.endDateTime
            ? this.filter.endDateTime + "Z"
            : "",
        },
      });

      const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${query}`;
      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          this.setTotalPages(data.page.totalPages)
          let events = [];
          const savedEvents = secureStorage().getItem("events");
          if (
            savedEvents &&
            savedEvents.calenderEvents &&
            savedEvents.rejectedEvents
          ) {
            (data?._embedded?.events || []).forEach((ev) => {
              const eventInCalender = savedEvents.calenderEvents.some(
                (event) => event.id === ev.id
              );
              if (!eventInCalender) {
                const eventRejected = savedEvents.rejectedEvents.some(
                  (event) => event.id === ev.id
                );
                if (!eventRejected) {
                  events.push(ev)
                }
              }
            });
          } else {
            events = data?._embedded?.events || []
          }
          return events;
        })
        .catch((error) => {
          return new Error(error);
        });
    },
    rejectEvent(event) {
      this.allEvents = this.allEvents.filter((ev) => ev.id !== event.id);
      this.setNextCard()
      let events = secureStorage().getItem("events");
      if (events) {
        events.rejectedEvents.push({ id: event.id, app: "ticketmaster" });
      } else {
        events = {
          rejectedEvents: [{ id: event.id, app: "ticketmaster" }],
          calenderEvents: [],
        };
      }
      presentToast("top", "Event discard", "danger");
      secureStorage().setItem("events", events);
    },
    addToCalender(event) {
      this.allEvents = this.allEvents.filter((ev) => ev.id !== event.id);
      this.setNextCard()
      let events = secureStorage().getItem("events");
      if (events) {
        events.calenderEvents.push({
          id: event.id,
          app: "ticketmaster",
          title: event.name,
          url: event.url,
          start: event?.dates?.start || {},
          end: event?.dates?.end || {},
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
              end: event?.dates?.end || {},
            },
          ],
        };
      }
      presentToast("top", "Event Added to Calender", "success");
      secureStorage().setItem("events", events);
    },
    setNextCard(){
      this.currentClass="from-bottom"
      if(this.currentEventIndex===this.allEvents.length-2 && this.page!==this.totalPages-1){
        this.page++
        this.searchEvents()
      }
      if(this.currentEventIndex===this.allEvents.length-1){
        this.setCurrentIndex(0)
      }else{
        this.setCurrentIndex(this.currentEventIndex+1)
      }
    },
    setPreviousCard(){
      this.currentClass="from-top"
      this.setCurrentIndex(this.currentEventIndex-1)
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
    }
  },
};
</script>
<style>
.from-top{
  animation: topToBottom 0.5s;
  animation-iteration-count: 1;
}
@keyframes topToBottom {
  from {transform: translateY(-100%);}
  to {transform: translateY(0%);}
}
.from-bottom{
  animation: bottomTOTop 0.5s;
  animation-iteration-count: 1;
}
@keyframes bottomTOTop {
  from {transform: translateY(100%);}
  to {transform: translateY(0%);}
}

</style>
