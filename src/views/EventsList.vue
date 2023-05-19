<template>
  <ion-page>
    <ion-header class="ion-border event-list-header-search">
      <div class="d-flex ion-justify-content-between ion-align-items-center">
        <ion-menu-button :auto-hide="false" menu="main-menu" color="primary">
          <ion-icon
            aria-hidden="true"
            :ios="optionsOutline"
            :md="optionsOutline"
            color="light"
            size="large"
          ></ion-icon>
        </ion-menu-button>
        <ion-input
          v-show="showSearch"
          style="max-width: 300px"
          label=""
          placeholder="Search Events"
          class="customProfile ion-margin-end"
          fill="outline"
          v-model="searchedEvent"
          :clear-input="true"
          debounce="500"
          @ion-input="searchEvents(true)"
          @ion-change="searchEvents(true)"
        ></ion-input>
        <ion-icon
          @click="showSearch = !showSearch"
          :ios="searchOutline"
          :md="searchOutline"
          color="light"
          size="large"
          style="margin-right: 10px"
        ></ion-icon>
      </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <IonCard class="d-flex flex-column ion-no-margin">
        <h2
          style="margin-top: 80px"
          class="ion-margin-horizontal"
          v-if="errorText"
        >
          {{ errorText }}
        </h2>
        <template v-else>
          <EventComponent
            v-if="eventsList.length > 0"
            :class="currentClass"
            :key="`event-${currentEventIndex}`"
            @reject-event="rejectEvent($event, index)"
            @add-to-calender="addToCalender($event, index)"
            @next-card="setNextCard"
            @previous-card="setPreviousCard"
            :event="eventsList[this.currentEventIndex]"
            :events-list-length="eventsList.length"
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
import { secureStorage, presentToast } from "@/services/utils.js";
import { mapActions, mapState } from "pinia";
import { eventStore } from "@/stores/eventStore";
import { keywordSearchQuery, categorySearchQuery } from "@/constant";
import axios from "@/service";
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
    IonHeader,
  },
  data() {
    return {
      optionsOutline,
      searchOutline,
      errorText: null,
      searchedEvent: "",
      latitude: null,
      longitude: null,
      page: 0,
      showSearch: false,
      meetupPagination: {},
      currentClass: "from-bottom",
    };
  },
  computed: {
    ...mapState(eventStore, [
      "filter",
      "currentEventIndex",
      "totalPages",
      "eventsList",
    ]),
  },
  watch: {
    filter: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal)!==JSON.stringify(oldVal)) {
          this.searchEvents(true);
        }
      },
      deep: true,
    },
    currentEventIndex(newVal, oldVal) {
      if (
        newVal === this.eventsList.length - 5 &&
        this.page !== this.totalPages - 1 &&
        newVal !== oldVal
      ) {
        this.page++;
        this.searchEvents();
      }
    },
  },
  async created() {
    this.getGeoLocation();
  },
  methods: {
    ...mapActions(eventStore, [
      "setCurrentIndex",
      "setTotalPages",
      "setEventList",
    ]),
    async getGeoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            if (this.eventsList.length === 0) {
              this.searchEvents(true);
            }
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
    async searchEvents(reset = false) {
      if (
        this.errorText &&
        this.errorText ===
          "Please allow Location Permission for better results."
      ) {
        return;
      }
      // if (
      //   Intl.DateTimeFormat().resolvedOptions().timeZone.includes("America")
      // ) {
      this.errorText = null;
      const ticketMaster = await this.getTicketMasterData(reset);
      const meetupData = await this.getMeetupData(reset);
      const data = [...ticketMaster, ...meetupData]
      if (reset) {
        this.setEventList(data);
        this.setCurrentIndex(0);
        if(data.length===0){
          this.errorText = "No Event Available.";
        }
      } else {
        this.setEventList([...this.eventsList,...data]);
      }
      // } else {
      //   this.setEventList([])
      //   this.errorText = "No Event Available for the Location.";
      // }
    },
    async getTicketMasterData(reset) {
      if (reset) {
        this.page = 0;
      }
      const query = {
        apikey: "02CT2Qgtn6XAEQwCqsPb2Hd7yXQZx19H",
        latlong: `${this.latitude},${this.longitude}`,
        page: this.page,
        locale: "*",
        sort: "date,asc",
        keyword: this.searchedEvent,
        radius: this.filter.radius || "",
        units: this.filter.unit || "",
        startDateTime: this.filter.startDateTime
            ? new Date(this.filter.startDateTime).toISOString().slice(0, 19) +
              "Z"
            : new Date().toISOString().slice(0, 19) + "Z",
        endDateTime: this.filter.endDateTime
            ? new Date(this.filter.endDateTime).toISOString().slice(0, 19) + "Z"
            : "",
      };
      const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json`;
      return axios
        .get(apiUrl, { params: query })
        .then(({ data }) => {
          this.setTotalPages(data.page.totalPages);
          let events = [];
          events = (data?._embedded?.events || []).map((event) => {
              return {
                id: event.id,
                title: event.name,
                startDate:
                  event?.dates?.start?.dateTime ||
                  event?.dates?.start?.localDate ||
                  null,
                endDate:
                  event?.dates?.end?.dateTime ||
                  event?.dates?.end?.localDate ||
                  null,
                venue: event?._embedded?.venues?.[0] || event?.place || {},
                image_url: this.getImage(event.images || []),
                distance: event.distance
                  ? `${event.distance} ${event.units}`
                  : null,
                from: "tm",
              };
            });
          return events;
        })
        .catch(() => {
          return []
        });
    },
    async getMeetupData(reset) {
      if (reset) {
        this.meetupPagination = {};
      }
      const variables = {
        first: 20,
        lat: this.latitude,
        lon: this.longitude,
        sortField: "DATETIME",
        source: "EVENTS",
        query: this.searchedEvent,
        startDateRange: this.filter.startDateTime ?  new Date(this.filter.startDateTime).toISOString() : new Date().toISOString()
      };
      if(this.filter.radius){
        variables.radius =  this.filter.unit==='km' ? Math.floor(this.filter.radius*0.621371) : this.filter.radius
      }
      if(this.filter.endDateTime){
        variables.endDateRange = new Date(this.filter.endDateTime).toISOString()
      }
      if (this.meetupPagination.hasNextPage) {
        variables.after = this.meetupPagination.endCursor;
      }
      let operationName = "";
      let query = "";
      if (this.searchedEvent) {
        operationName = "eventKeywordSearch";
        variables.query = this.searchedEvent;
        variables.source = "EVENTS";
        query = keywordSearchQuery;
      } else {
        operationName = "categorySearch";
        query = categorySearchQuery;
      }
      if(this.meetupPagination.hasNextPage!==false){
        return axios
          .post("https://barebone-aventis.programmers.us/meetup.php", {
            operationName,
            query,
            variables,
          }
        )
          .then(({ data }) => {
            this.meetupPagination =
              data?.data?.rankedEvents?.pageInfo ||
              data?.data?.results?.pageInfo ||
              {};
            const events = (
              data?.data?.rankedEvents?.edges ||
              data?.data?.results?.edges ||
              []
            ).map((res) => {
              return {
                id: res.node.id || res.node.result.id,
                title: res.node.title || res.node.result.title,
                startDate:
                  res?.node?.dateTime || res.node.result.dateTime || null,
                endDate: res?.node?.endTime || res.node.result.endTime || null,
                venue: res.node.venue || res.node.result.venue,
                image_url:
                  res?.node?.imageUrl ||
                  res?.node?.result?.imageUrl ||
                  null,
                from: "mu",
              };
            });
            return events;
          })
          .catch((error) => {
            console.log(error);
            return []
          });
      }else{
        return []
      }
    },
    rejectEvent(event) {
      const eventList = this.eventsList.filter((ev) => ev.id !== event.id);
      this.setEventList(eventList);
      this.setNextCard();
      let events = secureStorage().getItem("events");
      if (events) {
        events.rejectedEvents.push({ id: event.id, from: event.from });
      } else {
        events = {
          rejectedEvents: [{ id: event.id, from: event.from }],
          calenderEvents: [],
        };
      }
      presentToast("top", "Event discard", "danger");
      secureStorage().setItem("events", events);
    },
    addToCalender(event) {
      const eventList = this.eventsList.filter((ev) => ev.id !== event.id);
      this.setEventList(eventList);
      this.setNextCard();
      let events = secureStorage().getItem("events");
      if (events) {
        events.calenderEvents.push(event);
        secureStorage().setItem("events", events);
      } else {
        events = {
          rejectedEvents: [],
          calenderEvents: [event],
        };
      }
      presentToast("top", "Event Added to Calender", "success");
      secureStorage().setItem("events", events);
    },
    setNextCard() {
      this.currentClass = "from-bottom";
      if (this.currentEventIndex === this.eventsList.length - 1) {
        this.setCurrentIndex(0);
      } else {
        this.setCurrentIndex(this.currentEventIndex + 1);
      }
    },
    setPreviousCard() {
      this.currentClass = "from-top";
      this.setCurrentIndex(this.currentEventIndex - 1);
    },
    getImage(images) {
      const image = images.reduce((prev, current) => {
        const prevResolution = prev.width * prev.height;
        const currentResolution = current.width * current.height;

        return currentResolution > prevResolution ? current : prev;
      });
      return image?.url || "";
    },
  },
};
</script>
<style>
.input-clear-icon ion-icon {
  fill: var(--ion-color-light) !important;
}
.from-top {
  animation: topToBottom 0.5s;
  animation-iteration-count: 1;
}
@keyframes topToBottom {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0%);
  }
}
.from-bottom {
  animation: bottomTOTop 0.5s;
  animation-iteration-count: 1;
}
@keyframes bottomTOTop {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0%);
  }
}
</style>
