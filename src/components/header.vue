<template>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
</template>

<script>
import {IonHeader,IonToolbar, IonButtons, IonMenuButton, IonTitle} from '@ionic/vue';
    export default {
      name:'HeaderComponent',
        components:{
            IonHeader,IonToolbar, IonButtons, IonMenuButton, IonTitle
        }
    }
</script>

<style lang="scss" scoped>

</style>