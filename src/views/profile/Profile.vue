<template>
  <ion-page>
    <header-component />
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="top">
          <ion-tab-button
            tab="basicInfo"
            :class="currentTab === 'BasicInfoPage' ? 'active' : ''"
            @click="currentTab = 'BasicInfoPage'"
          >
            <ion-label> Basic Info</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="calnedar"
            :class="currentTab === 'CalendarPage' ? 'active' : ''"
            @click="currentTab = 'CalendarPage'"
          >
            <ion-label> Calendar</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
        <component :is="currentTab"></component>
        <!-- <basic-info-page v-if="currentTab==='basicInfo'"></basic-info-page>
    <calendar-page v-else /> -->
      </ion-tabs>
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
  // IonTabs,
  // IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonLabel,
  // IonIcon,
  // IonRouterOutlet,
} from "@ionic/vue";
import headerComponent from "@/components/header.vue";
import BasicInfoPage from "./BasicInfoPage.vue";
import CalendarPage from "./CalendarPage.vue";

export default {
  name: "ProfilePage",
  components: {
    IonContent,
    IonPage,
    headerComponent,
    IonHeader,
    // IonTabs,
    IonToolbar,
    IonTitle,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonLabel,
    // IonIcon,
    // IonRouterOutlet,
    // IonTabs,
    BasicInfoPage,
    CalendarPage,
  },
  data() {
    return {
      playCircle: "",
      search: "",
      currentTab: "BasicInfoPage",
    };
  },
};
</script>
