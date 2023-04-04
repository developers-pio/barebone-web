<template>
  <ion-page>
    <header-component />
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>
      Profile
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from "@ionic/vue";
import headerComponent from "@/components/header.vue";
export default {
  name: "ProfilePage",
  components: {
    IonContent,
    IonPage,
    headerComponent,
    IonHeader, 
    IonToolbar, 
    IonTitle
  },
};
</script>
