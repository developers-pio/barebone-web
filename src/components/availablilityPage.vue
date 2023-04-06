<template>
  <div>    <h2 class="gray-color">What's your availability?</h2>
    <ion-card class="commonCardClass" v-for="(item) in cards" :key="item">
    <ion-card-header>
      <!-- <ion-card-title>Mon</ion-card-title> -->
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
  props:["availability"],
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
      date:"",
      // available:{
      //   date:"",
      //   isAvailable:false
      // }
      
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
    // getDateTime(i = 0, date) {
    //   this.cards[i].month = date.toLocaleString("default", { month: "short" });
    //   this.cards[i].day = date.toLocaleString("default", { weekday: "long" });
    //   this.cards[i].date = date.getDate();
    // },
    changeRange(e,item){
      console.log(e.target.value,item)
 
      this.$emit('input',this.cards)
    },
    checkAvailibility(e,item){
      console.log(e.target.checked,item)
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
