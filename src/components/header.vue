<template>
  <ion-header class="ion-hide-lg-down" :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button
          color="primary"
          @click="
            setMenu({ name: 'navigation', active: menu.name === 'filter' })
          "
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
  menuController,
} from "@ionic/vue";
import { mapActions, mapState } from "pinia";
import { logOutOutline } from "ionicons/icons";
import { eventStore } from "@/stores/eventStore";
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
  computed: {
    ...mapState(eventStore, ["menu"]),
  },
  methods: {
    ...mapActions(eventStore, ["setMenu"]),
    openMainMenu() {
      menuController.open("main-content-menu-id");
    },
    signOut() {
      localStorage.removeItem("loggedIn");
      presentToast("top", "Logged out Successfully", "success");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped></style>
