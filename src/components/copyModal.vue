<template>
  <ion-icon
    size="large"
    :icon="shareSocialOutline"
    @click.stop="openModal()"
  ></ion-icon>
  <ion-modal id="example-modal" :is-open="isModalOpen" @closed="closeModal()">
    <ion-header>
      <ion-toolbar>
        <ion-title color="dark">Copy Link</ion-title>
        <ion-buttons slot="end">
          <ion-icon
            size="small"
            color="dark"
            :icon="close"
            @click="closeModal()"
          ></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <div class="wrapper">
      <div class="copy-input-field">
        <ion-input
          label=""
          fill="outline"
          readonly
          :value="textToCopy"
        ></ion-input>
        <ion-icon
          :icon="copy"
          color="primary"
          slot="end"
          @click="copyText()"
        ></ion-icon>
      </div>
    </div>
  </ion-modal>
</template>

<script>
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonInput,
} from "@ionic/vue";
import { copy, close, shareSocialOutline } from "ionicons/icons";
import { presentToast } from "@/services/utils.js";

export default {
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonInput,
  },
  props: {
    eventObject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isModalOpen: false,
      textToCopy: "",
      copy,
      close,
      shareSocialOutline,
    };
  },
  methods: {
    openModal() {
      this.textToCopy = `${window.location.origin}/event/${this.eventObject.from}/${this.eventObject.id}`;
      if (navigator.share) {
        navigator
          .share({
            title: this.eventObject.title,
            text: this.eventObject.description,
            url: this.textToCopy,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        this.isModalOpen = true;
      }
      //   this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    copyText() {
      navigator.clipboard
        .writeText(this.textToCopy)
        .then(() => {
          presentToast("top", "Link copied to clipboard!", "success");
        })
        .catch(() => {
          presentToast("top", "Failed to copy text", "danger");
        });
    },
  },
};
</script>

<style scoped>
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 350px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-modal#example-modal h1 {
  margin: 20px 20px 10px 20px;
}

ion-modal#example-modal ion-icon {
  margin-right: 6px;

  width: 48px;
  height: 48px;

  padding: 4px 0;

  color: #aaaaaa;
}

ion-modal#example-modal .wrapper {
  margin-bottom: 10px;
}
ion-modal#example-modal .wrapper .copy-input-field {
  margin: 10px;
  border: 2px solid;
  border-radius: 10px;
  display: flex;
}
ion-modal#example-modal .wrapper .copy-input-field ion-input {
  min-height: 56px !important;
  --padding-start: 0px !important;
}
</style>
