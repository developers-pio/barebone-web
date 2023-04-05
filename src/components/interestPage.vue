<template>
    <h2 class="gray-color">What interests you?</h2>
    <ion-row v-for="item in interest" :key="item.id" class="interest">
    <ion-col  >
        <h3 class="gray-color">{{ item.label }}</h3><br/>
        <article class="feature1" v-for="val in item.values" :key="val.id">
      <input type="checkbox" :id="`feature${val.id}`" />
      <div>
        <span> {{val.label}} </span>
      </div>
    </article>
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
// //   IonItem,
// //   IonLabel,
} from "@ionic/vue";
// import InterestPage from '../../components/interestPage.vue';
import constants from "../services/constants";
export default {
  name: "BasicInformation",
  components: {
    // IonPage,
    // IonContent,
    // IonInput,
    IonCol,
    IonRow,
    // InterestPage,
    // IonItem,
    // IonLabel,
  },
  data() {
    return {
        interest:""
    }
  },
  mounted() {
    this.interest=constants.interests
    // console.log(constants.interests);
  },
};
</script>
