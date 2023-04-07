<template>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary" @click="setMenu({name:'navigation',active: menu.name==='filter'})"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
</template>

<script>
import {IonHeader,IonToolbar, IonButtons, IonMenuButton, IonTitle, menuController} from '@ionic/vue';
import { mapActions,mapState  } from 'pinia'
import { eventStore  } from '@/stores/eventStore'
    export default {
      name:'HeaderComponent',
        components:{
            IonHeader,IonToolbar, IonButtons, IonMenuButton, IonTitle
        },
        computed: {
          ...mapState(eventStore,['menu'])
        },
        methods: {
          ...mapActions(eventStore,['setMenu']),
          openMainMenu() {
            menuController.open('main-content-menu-id')
          }
        },
    }
</script>

<style lang="scss" scoped>

</style>