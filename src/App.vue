<template>
  <ion-app>
    <component :is="layout">
    </component>
  </ion-app>
</template>

<script>
import {
  IonApp
} from "@ionic/vue";

export default {
  components: {
    IonApp
  },
  computed: {
    layout() {
      return `${this.$route.meta.layout || 'default'}-layout`;
    },
  },
};
</script>