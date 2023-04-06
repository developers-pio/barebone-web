<template>
  <ion-router-outlet></ion-router-outlet>
</template>

<script>
import { IonRouterOutlet } from "@ionic/vue";
export default {
  name: "DefaultLayout",
  components: {
    IonRouterOutlet
  },
};
</script>
