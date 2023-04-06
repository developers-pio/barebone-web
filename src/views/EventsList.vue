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
        <h2 class="ion-margin ion-margin-vertical" v-if="errorText">{{errorText}}</h2>
        <template v-else>
        <RecycleScroller class="ion-content-scroll-host scroller" :items="allEvents" :item-size="416" key-field="id"
          v-slot="{ item }">
            <EventComponent :event="item" class="ion-padding-bottom"/>
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
  menuController
} from "@ionic/vue";
import { optionsOutline } from "ionicons/icons";
import HeaderComponent from "@/components/header.vue";
import EventComponent from "@/components/event.vue";
import { RecycleScroller } from 'vue-virtual-scroller';
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
      errorText:null,
      page:0,
    };
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(lat,lng)
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
        this.errorText=null
        const ticketMaster = await this.getTicketMasterData(lat, lng);
        this.allEvents = [...this.allEvents, ...ticketMaster]
      }else{
        this.errorText = 'No Event Available for the Location.'
      }
      // const apiKey = "AIzaSyCbn46iLzum-W4sfNQKNEWsRRscE1L6Ukk";
      // const searchEngineId = "9216e749b11634d7e";
      // const query = "events near me";
      // const location = `${lat},${lng}`;
      // const radius = "10mi";

      // // const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&cr=${location}&sort=date-s:d1&dateRestrict=future&exactTerms=event&imgSize=medium&imgType=photo&rights=cc_publicdomain,cc_attribute,cc_sharealike&searchType=image&imgDominantColor=white&imgColorType=color&imgSize=medium&imgSize=large&imgSize=huge&imgSize=icon&imgSize=xlarge&imgSize=xxlarge&imgSize=xxxlarge&imgSize=400x300&imgSize=640x480&imgSize=800x600&imgSize=1024x768&imgSize=1280x1024&imgSize=1600x1200&imgSize=2000x1500&imgSize=2048x1536&imgSize=2560x1920&imgSize=3200x2400&imgSize=4000x3000&imgSize=5000x3750&imgSize=5500x4125&imgSize=6000x4500&imgSize=6400x4800&imgSize=7000x5250&imgSize=8000x6000&imgSize=9000x6750&imgSize=10240x7680`;
      // const apiUrl = `https://www.googleapis.com/search?search_engine=google_events&key=${apiKey}&cx=${searchEngineId}&q=${query}&cr=${location}`;
    },
    async getTicketMasterData(lat, lng) {
      const query = new URLSearchParams({
        apikey:'02CT2Qgtn6XAEQwCqsPb2Hd7yXQZx19H',
        latlong:`${lat},${lng}`,
        page:0,
        sort:'name,asc',
        locale:'*'
      })

      const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${query}`;
      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const events = data._embedded.events;
          return events;
        })
        .catch((error) => console.error(error));
    },
    openFilterDrawer(){
      menuController.open('filter-menu')
    }
  },
};
</script>
<style>
.scroller{
  height: 100%;
}
.vue-recycle-scroller__item-view{
  padding: 10px 0px;
}
</style>
