<template>
  <ion-page>
    <ion-content :fullscreen="true" class="login-page-background">
      <div
        class="d-flex w-100 h-100 ion-justify-content-center ion-align-items-center"
      >
        <div class="login-form">
          <h1 class="WelcomeMessage">
            Hello,<br />
            Aventi.
          </h1>
          <ion-row
            ><ion-col size="12">
              <label class="labelClass">Email </label>
              <ion-input
                aria-label="Email"
                placeholder="Email *"
                fill="outline"
                class="custom"
                autocomplete="none"
                v-model="formData.email"
                :error-text="errors.email"
                type="email"
                ><span
                  slot="error"
                  v-if="errors.email"
                  style="color: white; padding-left: 15px"
                  >{{ errors.email }}</span
                >
              </ion-input>
            </ion-col></ion-row
          >
          <ion-row
            ><ion-col size="12">
              <label class="labelClass">Password </label>
              <ion-input
                aria-label="Password"
                placeholder="Password *"
                type="password"
                fill="outline"
                autocomplete="none"
                class="custom"
                v-model="formData.password"
                ><span
                  slot="error"
                  v-if="errors.password"
                  style="color: white; padding-left: 15px"
                  >{{ errors.password }}</span
                >
              </ion-input>
            </ion-col>
          </ion-row>
          <ion-row
            ><ion-col size="12">
              <ion-button
                v-if="!loading"
                color="light"
                shape="round"
                expand="block"
                @click="formSubmit()"
                >Login</ion-button
              >
              <ion-button
                v-else
                color="light"
                shape="round"
                expand="block"
                disabled=""
                >Login &nbsp; <ion-spinner color="medium"></ion-spinner>
              </ion-button>
            </ion-col>
          </ion-row>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonInput,
  IonButton,
  IonContent,
  IonPage,
  IonCol,
  IonRow,
  IonSpinner,
} from "@ionic/vue";
import { presentToast } from "../services/utils";
export default {
  name: "LoginPage",
  components: {
    IonInput,
    IonCol,
    IonRow,
    IonButton,
    IonContent,
    IonPage,
    IonSpinner,
  },
  data() {
    return {
      errors: {
        email: "",
        password: "",
      },
      formData: {
        email: null,
        password: null,
      },
      loading: false,
    };
  },

  watch: {
    "formData.email"(newVal) {
      this.errors.email = "";
      if (!newVal) {
        this.errors.email = "Email Field is required.";
      }else if(!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(newVal)){
        this.errors.email = "Please Enter a valid Email.";
      }
    },
    "formData.password"(newVal) {
      this.errors.password = "";
      if (!newVal) {
        this.errors.password = "Password Field is required.";
      }
    },
  },

  methods: {
    formSubmit() {
      if ([null, undefined, ""].includes(this.formData.email)) {
        this.errors.email = "Email Field is required";
      }
      if ([null, undefined, ""].includes(this.formData.password)) {
        this.errors.password = "Password Field is required";
      }
      if (this.errors.email === "" && this.errors.password === "") {
        this.loading = true;
        setTimeout(() => {
          if (
            process.env.VUE_APP_EMAIL === this.formData.email &&
            process.env.VUE_APP_PASSWORD === this.formData.password
          ) {
            localStorage.setItem("loggedIn", true);
            this.$router.push({ path: "/events" });
            presentToast("top", "Successfully Logged In", "success");
          } else {
            presentToast("top", "Invalid Credentials", "danger");
          }
          this.loading = false;
        }, 2000);
      }
    },
  },
};
</script>

<style scoped></style>
