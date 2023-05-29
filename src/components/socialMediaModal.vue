<template>
  <ion-modal
    id="example-modal"
    :is-open="isModalOpen"
    @didDismiss="$emit('close-modal')"
  >
    <div class="wrapper">
      <div class="title">Please Login to Add Event to Calender</div>
      <div class="d-flex ion-justify-content-end">
        <ion-button
          shape="round"
          size="small"
          color="primary"
          @click="handleAuthClick"
          >Login to Gmail</ion-button
        >
        <ion-button
          shape="round"
          size="small"
          color="light"
          @click="$emit('close-modal')"
          >Cancel</ion-button
        >
      </div>
    </div>
  </ion-modal>
</template>

<script>
import { IonModal, IonButton } from "@ionic/vue";

export default {
  components: {
    IonModal,
    IonButton,
  },
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleAuthClick() {
      if (window.gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        window.tokenClient.requestAccessToken({ prompt: "consent" });
        // this.$emit('close-modal')
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        window.tokenClient.requestAccessToken({ prompt: "" });
      }
    },
  },
};
</script>

<style scoped>
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 350px;
  --max-width: 90%;
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
  padding: 10px;
}

ion-modal#example-modal .wrapper .title {
  font-size: 20px;
  font-weight: 600;
}
</style>
