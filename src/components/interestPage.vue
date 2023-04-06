<template>
  <h2 class="gray-color">What interests you?</h2>
  <ion-row v-for="(data, inter) in interestData" :key="inter" class="interest">
    <ion-col>
      <h3 class="gray-color">{{ inter }}</h3>
      <br />
      <!-- <article class="feature1" v-for="val in item.values" :key="val.id"> -->

      <div>
        <ion-chip
          :class="getActiveStatus(inter,val) ? 'active' : ''"
          v-for="val in data"
          :key="val"
          @click="changeInterest(inter,val)"
        >
          {{ val }}
        </ion-chip>
      </div>
      <!-- </article> -->
    </ion-col>
  </ion-row>

  <!-- </div> -->
</template>

<script>
import {
  // //   IonPage,
  // //   IonContent,
  // //   IonInput,
  IonCol,
  IonRow,
  IonChip,
  // //   IonItem,
  // //   IonLabel,
} from "@ionic/vue";
// import InterestPage from '../../components/interestPage.vue';
// import constants from "../services/constants";
export default {
  name: "BasicInformation",
  props: ["interests"],
  emits: ["addInterests"],
  components: {
    // IonPage,
    // IonContent,
    // IonInput,
    IonChip,
    IonCol,
    IonRow,
    // InterestPage,
    // IonItem,
    // IonLabel,
  },
  data() {
    return {
      interest: {},
      interestData: {
        Adventures: [
          "Rock-Climbing",
          "Horse-Riding",
          "River-Rafting",
          "Under-Water-Diving",
          "Scooba-Diving",
          "Trekking",
          "Camping",
          "Hot Air Ballooning",
          "Skiing",
        ],
        Sports: [
          "Cricket",
          "Aquatics ",
          "Archery",
          "Athletics",
          "Boxing",
          "Freestyle",
          "Polo",
          "Canoe",
        ],
      },
    };
  },
  
  mounted() {
    // setTimeout(() => {
    //  this.interest= this.interests;
    // }, 1000);
    // console.log(this.interests)
    // console.log(constants.interests);
  },

  methods: {
    changeInterest(key,value) {
        const interest={...this.interests}
      let interestExist=interest[key].findIndex(item=>item===value)
      if(interestExist==-1){
          interest[key].push(value)
        }
        else{
            interest[key].splice(interestExist,1)
        }
        this.$emit('input',interest)
    },
    getActiveStatus(key,value) {
        const interest={...this.interests}
        if(interest[key]){
            let interestExist=interest[key].findIndex(item=>item===value)
          if(interestExist==-1){
            return false
          }
        return true

        }
      
       return false
   
       
      
    },
  },
};
</script>
