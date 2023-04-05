<template>
  <ion-content style="height:110%">
    <h2 class="gray-color">Basic Information</h2>
    <div style="max-width: 660px; margin: 0 auto; padding-top: 50px">
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
          ></ion-input>

          <!-- <span
                      slot="error"
                      v-if="errors.email"
                      style="color: white; padding-left: 15px"
                      >{{ errors.email }}</span
                    > -->
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
          ></ion-input>

          <!-- <span
                      slot="error"
                      v-if="errors.email"
                      style="color: white; padding-left: 15px"
                      >{{ errors.email }}</span
                    > -->
        </ion-col>
        <ion-col size="12">
          <label class="labelClassProfile">Date of Birth </label>

          <ion-datetime-button datetime="datetime" calss="dateTimeField"
            ><slot name="date-target"></slot
          ></ion-datetime-button>

          <ion-modal ref="modal" :keep-contents-mounted="true">
            <!-- <ng-template> -->
            <ion-datetime id="datetime" @ion-change="dismiss()"></ion-datetime>
            <!-- </ng-template> -->
          </ion-modal>

          <!-- <span
                      slot="error"
                      v-if="errors.email"
                      style="color: white; padding-left: 15px"
                      >{{ errors.email }}</span
                    > -->
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
            :value="formData.location"
          ></ion-input>

          <!-- <span
                      slot="error"
                      v-if="errors.email"
                      style="color: white; padding-left: 15px"
                      >{{ errors.email }}</span
                    > -->
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
            :value="formData.email"
          ></ion-input>

          <!-- <span
                      slot="error"
                      v-if="errors.email"
                      style="color: white; padding-left: 15px"
                      >{{ errors.email }}</span
                    > -->
        </ion-col>

        <ion-col size="12">
          <!-- <label class="labelClassProfile">Email </label> -->

          <interest-page />
        </ion-col>
        <ion-col size="12">
          <!-- <label class="labelClassProfile">Email </label> -->

          <availablility-page />
        </ion-col>
      </ion-row>
    </div>
  </ion-content>
</template>

<script>
import {
  //   IonPage,
  IonContent,
  IonInput,
  IonCol,
  IonRow,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  //   IonItem,
  //   IonLabel,
} from "@ionic/vue";
import InterestPage from "../../components/interestPage.vue";
import AvailablilityPage from "../../components/availablilityPage.vue";
import constants from '../../services/constants';
export default {
  name: "BasicInformation",
  components: {
    // IonPage,
    IonContent,
    IonInput,
    IonCol,
    IonRow,
    InterestPage,
    AvailablilityPage,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    // IonItem,
    // IonLabel,
  },
  mounted() {
    
    this.formData.email = process.env.VUE_APP_EMAIL;
    this.formData.location=constants.location
    // console.log(document.getElementsByClassName("ion-color ion-color-primary md"))
  },
  methods: {
    dismiss() {
      this.$refs.modal.$el.dismiss();
    },
  },
  data() {
    return {
      formData: {
        email: "",
        location:""
      },
    };
  },
};
</script>
