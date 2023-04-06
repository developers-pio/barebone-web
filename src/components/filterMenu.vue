Copy code
<template>
  <ion-menu side="start" content-id="main-content">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>Item 1</ion-item>
        <ion-item>Item 2</ion-item>
        <ion-item>Item 3</ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button>
            <ion-icon
                aria-hidden="true"
                :ios="optionsOutline"
                :md="optionsOutline"
                color="primary"
                size="large"
        ></ion-icon>
        </ion-menu-button>
      </ion-buttons>
      <ion-title>Main Content</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content id="main-content">
    <p>This is the main content.</p>
  </ion-content>
</template>

<script>
import { IonMenu,IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonMenuButton, IonButtons } from "@ionic/vue";
import { optionsOutline } from "ionicons/icons";
export default {
  components: { IonMenu, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonMenuButton, IonButtons },
  data() {
    return {
        optionsOutline
    }
  },
};
</script>