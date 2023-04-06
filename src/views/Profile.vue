<template>
  <ion-page>
    <header-component />
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

        <div class="d-flex ion-justify-center">
          <ion-button
            tab="basicInfo"
            :class="currentTab === 'BasicInfoPage' ? 'active' : ''"
            @click="currentTab = 'BasicInfoPage'"
          >
            <ion-label> Basic Info</ion-label>
          </ion-button>

          <ion-button
            tab="calnedar"
            :class="currentTab === 'CalendarPage' ? 'active' : ''"
            @click="currentTab = 'CalendarPage'"
          >
            <ion-label> Calendar</ion-label>
          </ion-button>
        </div>
      <component :is="currentTab"></component>
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
  IonTabBar,
  IonButton,
  IonLabel,
} from "@ionic/vue";
import headerComponent from "@/components/header.vue";
import BasicInfoPage from "@/components/BasicInfoPage.vue";
import CalendarPage from "@/components/CalendarPage.vue";

export default {
  name: "ProfilePage",
  components: {
    IonContent,
    IonPage,
    headerComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonTabBar,
    IonButton,
    IonLabel,
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
