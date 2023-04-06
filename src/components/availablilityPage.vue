<template>
  <ion-content>    
    <h2 class="gray-color">What's your availability?</h2>
    <ion-card class="commonCardClass" v-for="(item) in cards" :key="item">
    <ion-card-header>
      <div>
        <span class="commonCardText">{{ getDay(item.date) }}</span>
        <span class="commonCardmonth">{{ getMonth(item.date) }} {{ getDate(item.date) }}  </span>
        <span style="float: right;">   <ion-toggle size="small" :checked="item.isAvailable" v-model="item.isAvailable" @ion-change="checkAvailibility($event,item)" aria-label="" ></ion-toggle></span>
      </div>
    </ion-card-header>

    <ion-card-content>
      <ion-range
        aria-label="Dual Knobs Range"
        :dual-knobs="true"
        :pin="true"
        v-model="item.range"
        @ion-change="changeRange($event,item)" 
        max="23"
        Min="0"
        :pinFormatter="(value) =>  `${value<10?'0':''}${Math.round(value)}:00`"
      ></ion-range>
      <div style="text-align: center">
        <ion-button @click="createCard(item.date)">+</ion-button>
      </div>
    </ion-card-content>
  </ion-card>
  </ion-content>
</template>

<script>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonRange,
  IonButton,
  IonContent,
  IonToggle
} from "@ionic/vue";
export default {
  props:{
    availability:{
      type: Object,
      required: true
    }
  },
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonRange,
    IonButton,
    IonContent,
    IonToggle
  },
  data() {
    return {
      cards: [
      ],
      date:"",
    };
  },
  mounted() {
    setTimeout(()=>{
    this.cards=this.availability
    },500)
  },
  methods: {
    createCard(date) {
     this.date = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
     
      let obj = {
        date:  this.date,
        isAvailable: false,
        range:{lower: 0, upper: 23}
      };
      this.cards.push(obj);
    },
    changeRange(){ 
      this.$emit('input',this.cards)
    },
    checkAvailibility(){
      this.$emit('input',this.cards)
    },
    getDay(val){
      return  new Date(val).toLocaleString("default", { weekday: "long" });
    },
    getMonth(val){
      return new Date(val).toLocaleString("default", { month: "short" });
    },
    getDate(val){
      return new Date(val).getDate();
    }
  },
};
</script>
