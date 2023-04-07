<template>
  <div style="height: 110%">
    <h2 class="gray-color">Basic Information</h2>
    <div style="max-width: 660px; margin: 0 auto; padding-top: 20px">
      <ion-row
        ><ion-col size="12">
          <label class="labelClassProfile">First Name</label>

          <ion-input
            aria-label="First Name"
            placeholder="First Name *"
            type="text"
            fill="outline"
            autocomplete="none"
            class="customProfile"
            v-model="formData.firstName"
          ></ion-input>
        </ion-col>
        <ion-col size="12">
          <label class="labelClassProfile">Last Name</label>

          <ion-input
            aria-label="Last Name"
            placeholder="Last Name *"
            type="text"
            fill="outline"
            autocomplete="none"
            class="customProfile"
            v-model="formData.lastName"
          ></ion-input>
        </ion-col>
        <ion-col size="12">
          <label class="labelClassProfile">Date of Birth </label>

          <ion-datetime-button datetime="datetime" calss="dateTimeField" style="display: none;"
            ><slot name="date-target"></slot
          ></ion-datetime-button>
          <ion-input
            aria-label="dob"
            placeholder="Date Of Birth"
            type="text"
            id="open-modal"
            fill="outline"
            autocomplete="none"
            :readonly="true"
            class="customProfile"
            v-model="formData.dob"
            @click="datepicker=true"
          ></ion-input>
            
                <ion-modal ref="modal" trigger="open-modal" :keep-contents-mounted="true">
            <ion-datetime
              id="datetime"
              v-model="formData.dob"
              presentation="date"
              @ion-change="dismiss()"
            ></ion-datetime>
          </ion-modal>
               
        </ion-col>

        <ion-col size="12">
          <label class="labelClassProfile">Location</label>

          <ion-input
            aria-label="Location"
            placeholder="Location"
            type="text"
            fill="outline"
            autocomplete="none"
            class="customProfile"
            v-model="formData.location"
          ></ion-input>

        </ion-col>
        <ion-col size="12">
          <label class="labelClassProfile">Email </label>

          <ion-input
            aria-label="Email"
            placeholder="Email"
            type="text"
            fill="outline"
            autocomplete="none"
            class="customProfile"
            readonly
            v-model="formData.email"
          ></ion-input>

        </ion-col>

        <ion-col size="12">
          <interest-page
            :interests="formData.interests || {}"
            v-model="formData.interests"
            @addInterests="addInterests($event)"
          />
        </ion-col>
        <ion-col size="12">
          <availablility-page
            :availability="formData.availability || []"
            v-model="formData.availability"  
          />
        </ion-col>
        <ion-col size="12">
          <ion-button
            v-if="!loading"
            color="primary"
            shape="round"
            expand="block"
            @click="formSubmit()"
            >Submit</ion-button
          >
          <ion-button
            v-else
            color="secondary"
            shape="round"
            expand="block"
            disabled=""
            >Submitting.. &nbsp; <ion-spinner color="medium"></ion-spinner>
          </ion-button>
        </ion-col>
      </ion-row>
    </div>
  </div>
</template>

<script>
import {
  IonInput,
  IonCol,
  IonRow,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonButton,
  IonSpinner
} from "@ionic/vue";
import InterestPage from "@/components/interestPage.vue";
import AvailablilityPage from "@/components/availablilityPage.vue";
import userStaticData from "@/services/constants";
import { secureStorage } from "@/services/utils"
import { presentToast } from "@/services/utils"
export default {
  name: "BasicInformation",
  components: {
    IonInput,
    IonCol,
    IonRow,
    InterestPage,
    AvailablilityPage,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonButton,
    IonSpinner
  },
   mounted() {
    const userData = secureStorage().getItem('userInfo')
    if(userData){
        this.formData = userData
    }else{
        this.formData = userStaticData.userStaticData
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.$el.dismiss();
    },
    formSubmit() {
        this.loading=true
        setTimeout(()=>{
            presentToast("top", "Profile Updated Successfully", "success");
            secureStorage().setItem('userInfo',this.formData)
            this.loading=false
        },2000)
    },
    addInterests(e) {
      console.log(e);
    },
  },
  data() {
    return {
      formData: {
        email: "",
        location: "",
        firstName: "",
        lastName: "",
        dob: "2023-04-05",
        interests: {},
        availability: [],
      },
      interest:{},
      loading: false,
      datepicker:false
      
    };
  },
};
</script>
