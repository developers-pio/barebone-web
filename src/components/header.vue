<template>
  <ion-header class="ion-hide-lg-down" :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button
          color="primary"
          menu="main-menu"
        ></ion-menu-button>
      </ion-buttons>
      <ion-title>{{ $route.name }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-header class="ion-hide-lg-up">
    <ion-toolbar>
      <div
        class="d-flex ion-margin ion-justify-content-between ion-padding-start ion-padding-end"
      >
        <ion-title @click="signOut" class="ion-padding-start ion-padding-end ion-text-center"
          ><ion-icon :icon="logOutOutline"></ion-icon>Sign Out</ion-title
        >
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
} from "@ionic/vue";
import { logOutOutline } from "ionicons/icons";
import { presentToast } from "@/services/utils";
export default {
  name: "HeaderComponent",
  data() {
    return {
      logOutOutline,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
  },
  methods: {
    signOut() {
      localStorage.removeItem("loggedIn");
      presentToast("top", "Logged out Successfully", "success");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped></style>
