<template>
  <div>    <h2 class="gray-color">What's your availability?</h2>
    <ion-card class="commonCardClass" v-for="item in cards" :key="item">
    <ion-card-header>
      <!-- <ion-card-title>Mon</ion-card-title> -->
      <div>
        <span class="commonCardText">{{ item.day }}</span>
        <span class="commonCardmonth">{{ item.month }} {{ item.date }}</span>
        <span style="float: right;">   <ion-toggle size="small" aria-label=""></ion-toggle></span>
     
      </div>
    </ion-card-header>

    <ion-card-content>
      <ion-range
        aria-label="Dual Knobs Range"
        :dual-knobs="true"
        :pin="true"
        :value="{ lower: 1, upper: 24 }"
        max="23"
        Min="0"
        :pinFormatter="(value) =>  `${value<10?'0':''}${Math.round(value)}:00`"
      ></ion-range>
      <div style="text-align: center">
        <ion-button @click="createCard">+</ion-button>
      </div>
    </ion-card-content>
  </ion-card>
  </div>
 
</template>

<script>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonRange,
  IonButton,
  // IonIcon,
  IonToggle
} from "@ionic/vue";

export default {
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonRange,
    IonButton,
    // IonIcon,
    IonToggle
  },
  data() {
    return {
      cards: [
        {
          month: "",
          day: "",
          date: "",
        },
      ],
      date:""
      
    };
  },
  
  mounted() {
    this.date = new Date();
    this.getDateTime(0, this.date);
  },
  methods: {
    createCard() {
     this.date = new Date(new Date(this.date).getTime() + 24 * 60 * 60 * 1000);
     
      let obj = {
        month: this.date.toLocaleString("default", { month: "short" }),
        day: this.date.toLocaleString("default", { weekday: "long" }),
        date: this.date.getDate(),
      };
      this.cards.push(obj);
    },
    getDateTime(i = 0, date) {
      this.cards[i].month = date.toLocaleString("default", { month: "short" });
      this.cards[i].day = date.toLocaleString("default", { weekday: "long" });
      this.cards[i].date = date.getDate();
    },
  },
};
</script>
