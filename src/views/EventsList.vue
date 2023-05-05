<template>
  <ion-page>
    <ion-header class="ion-border" style="background-color: white; padding: 5px 6px; ">
      <div class="d-flex ion-justify-content-between ion-align-items-center">
        <ion-menu-button
          :auto-hide="false"
          color="primary"
          @click="setMenu({ name: 'filter', active: getMenuStatus() })"
        >
          <ion-icon
            aria-hidden="true"
            :ios="optionsOutline"
            :md="optionsOutline"
            color="primary"
            size="large"
          ></ion-icon>
        </ion-menu-button>
        <ion-input
          style="max-width: 300px"
          label=""
          placeholder="Search Events"
          class="customProfile"
          fill="outline"
          v-model="searchedEvent"
          debounce="500"
          @ion-input="searchEvents(true)"
          :class="mobileView ? 'ion-margin-end' : ''"
        ></ion-input>
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
          <!-- <template
            v-for="(item, index) in allEvents"
            :key="index"
          > -->
            <EventComponent
              v-if="allEvents.length > 0"
              @reject-event="rejectEvent($event, index)"
              @add-to-calender="addToCalender($event, index)"
              :event="allEvents[0]"
            />
          <!-- </template> -->
        </template>
        <!-- <ion-spinner
          v-if="totalPages > 0 && page < totalPages - 1"
          color="medium"
          class="load-more-events"
          style="margin: 10px auto"
        ></ion-spinner> -->
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
  // IonSpinner,
  IonMenuButton,
} from "@ionic/vue";
import { optionsOutline } from "ionicons/icons";
import FooterComponent from "@/components/footer.vue";
import EventComponent from "@/components/event.vue";
import {
  secureStorage,
  // observeElement,
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
    // IonSpinner,
    IonMenuButton,
    FooterComponent,
    IonHeader
  },
  data() {
    return {
      optionsOutline,
      allEvents: [],
      errorText: null,
      searchedEvent: "",
      latitude: null,
      longitude: null,
      totalPages: 0,
      page: 0,
    };
  },
  beforeUnmount() {
    this.setMenu({ name: "navigation", active: window.innerWidth < 992 });
  },
  computed: {
    ...mapState(eventStore, ["menu", "filter"]),
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
    ...mapActions(eventStore, ["setMenu"]),
    async searchEvents(reset = false) {
      if (
        this.errorText &&
        this.errorText ===
          "Please allow Location Permission for better results."
      ) {
        return;
      }
      if (reset) {
        this.page = 0;
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
        // observeElement(
        //   document.querySelector(".load-more-events"),
        //   this.isObserverIntersecting
        // );
      } else {
        this.allEvents = [...this.allEvents, ...ticketMaster];
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
          this.totalPages = data.page.totalPages;
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
                  events.push(ev);
                }
              }
            });
          } else {
            events = data?._embedded?.events || [];
          }
          return events;
        })
        .catch((error) => {
          return new Error(error);
        });
    },
    rejectEvent(event) {
      this.allEvents = this.allEvents.filter((ev) => ev.id !== event.id);
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
      this.allEvents = this.allEvents.filter((ev) => ev.id !== event.id);
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
    isObserverIntersecting(entry) {
      if (entry.isIntersecting) {
        this.page++;
        this.searchEvents();
      }
    },
    getMenuStatus() {
      if (window.innerWidth < 992) {
        return true;
      }
      return this.menu.name === "navigation";
    },
  },
};
</script>
<style>
.scroller {
  height: 100%;
}
</style>
