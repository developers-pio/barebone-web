<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div>
        <h1>404 Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </ion-content>
    <footer-component></footer-component>
  </ion-page>
</template>

<script>
import { IonPage, IonContent } from "@ionic/vue";
import footerComponent from "@/components/footer.vue";
export default {
  components: {
    IonPage,
    IonContent,
    footerComponent,
  },
};
</script>
