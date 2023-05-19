<template>
  <ion-footer class="ion-border ion-hide-lg-up" :translucent="true">
    <ion-toolbar color="dark">
      <div
        class="d-flex ion-margin ion-justify-content-between ion-padding-start ion-padding-end"
      >
        <ion-title
          @click="goToHome"
          :style="{ color: $route.name === 'Events' ? '#195339' : '' }"
          class="ion-padding-start ion-padding-end ion-text-center"
          ><ion-icon class="ion-padding-end" :icon="homeOutline"></ion-icon
          >Home</ion-title
        >
        <ion-title class="ion-padding-start ion-padding-end ion-text-center">
          |
        </ion-title>
        <ion-title
          @click="goToProfile"
          :style="{ color: $route.name === 'Calender' ? '#195339' : '' }"
          class="ion-padding-start ion-padding-end ion-text-center"
          ><ion-icon class="ion-padding-end" :icon="calendarOutline"></ion-icon
          >Calender</ion-title
        >
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script>
import { IonFooter, IonToolbar, IonTitle, IonIcon } from "@ionic/vue";
import { homeOutline, calendarOutline } from "ionicons/icons";
export default {
  name: "FooterComponent",
  components: {
    IonFooter,
    IonToolbar,
    IonTitle,
    IonIcon,
  },
  methods: {
    goToHome() {
        this.$router.push("/events")
    },
    goToProfile() {
        this.$router.push("/calender")
    }
  },
  data() {
    return {
      homeOutline,
      calendarOutline,
    };
  },
};
</script>

<style lang="scss" scoped></style>
