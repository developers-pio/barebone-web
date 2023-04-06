<template>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary" menu="main-menu"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
</template>

<script>
import {IonHeader,IonToolbar, IonButtons, IonMenuButton, IonTitle, menuController} from '@ionic/vue';
    export default {
      name:'HeaderComponent',
        components:{
            IonHeader,IonToolbar, IonButtons, IonMenuButton, IonTitle
        },
        methods: {
          openMainMenu() {
            console.log('here')
            menuController.open('main-content-menu-id')
          }
        },
    }
</script>

<style lang="scss" scoped>

</style>