<template>
  <div>
    <h2 class="gray-color">What interests you?</h2>
    <ion-row v-for="(data, inter) in interestData" :key="inter" class="interest">
      <ion-col>
        <h3 class="gray-color">{{ inter }}</h3>
        <br />
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
      </ion-col>
    </ion-row>
  </div>
</template>

<script>
import {
  IonCol,
  IonRow,
  IonChip,
} from "@ionic/vue";
export default {
  name: "BasicInformation",
  props: {
    interests:{
      type: Object,
      default: ()=>{}
    }
  },
  emits: ["addInterests"],
  components: {
    IonChip,
    IonCol,
    IonRow,
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
