<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/events"></ion-back-button>
        </ion-buttons>
        <ion-title>Event Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <template v-if="Object.keys(eventDetails).length">
          <div class="event-image-container ion-padding-horizontal">
            <img :src="eventDetails?.images[0]?.url" alt="Event Image" />
          </div>

          <div class="event-info-container">
            <h2>Event Name:</h2>
            <p>{{ eventDetails.name }}</p>

            <h2>Start Date and Time:</h2>
            <p>{{ getDate(eventDetails.dates.start.dateTime) }}</p>

            <h2>Tags:</h2>
            <div
              class="d-flex"
              v-for="(classification, index) in eventDetails.classifications ||
              []"
              :key="`classification-${index}`"
            >
              <ion-chip
                v-if="
                  classification.segment &&
                  classification.segment.name != 'Undefined'
                "
                >{{ classification.segment.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.genere &&
                  classification.genere.name != 'Undefined'
                "
                >{{ classification.genre.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.subGenre &&
                  classification.subGenre.name != 'Undefined'
                "
                >{{ classification.subGenre.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.type && classification.type.name != 'Undefined'
                "
                >{{ classification.type.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.subType &&
                  classification.subType.name != 'Undefined'
                "
                >{{ classification.subType.name }}</ion-chip
              >
            </div>
            <h2>Info:</h2>
            <p>
              {{ eventDetails.info || "NA" }}
            </p>
            <h2>Promoter:</h2>
            <p>
              {{ eventDetails?.promoter?.name || "NA" }}
            </p>
            <h2>Price Range:</h2>
            <p>
              {{
                eventDetails.priceRanges && eventDetails.priceRanges[0]
                  ? `${eventDetails.priceRanges[0].min} - ${eventDetails.priceRanges[0].max} ${eventDetails.priceRanges[0].currency}`
                  : "NA"
              }}
            </p>
            <template v-if="eventDetails._embedded.venues">
              <h2>Venue Name:</h2>
              <p>
                {{ eventDetails?._embedded?.venues[0]?.name || '' }}
              </p>
              <h2>Venue Location:</h2>
              <p>
                {{
                  eventDetails._embedded.venues[0]
                    ? `${eventDetails?._embedded?.venues[0]?.address?.line1 || ''}, ${eventDetails?._embedded?.venues[0]?.city?.name || ''}, ${eventDetails?._embedded?.venues[0]?.state?.name || ''}, ${eventDetails?._embedded?.venues[0]?.country?.name || ''}`
                    : "NA"
                }}
              </p>
              <h2>Venue Info:</h2>
              <p>
                {{ eventDetails.pleaseNote || "NA" }}
              </p>
            </template>
            <template v-if="eventDetails._embedded.attractions && eventDetails?._embedded?.attractions[0]">
              <h2>Artist Info:</h2>
              <p>
                <a
                  :href="eventDetails?._embedded?.attractions[0]?.url"
                  target="_blank"
                  >{{ eventDetails?._embedded?.attractions[0]?.url }}</a
                >
              </p>

              <h2>Artist Social Info:</h2>
              <p class="d-flex" style="gap: 20px">
                <template
                  v-for="(data, socialMedia) in eventDetails?._embedded
                    ?.attractions[0]?.externalLinks || {}"
                  :key="socialMedia"
                >
                  <a :href="data[0].url" target="_blank">
                    <ion-icon
                      aria-hidden="true"
                      :ios="getIcon(socialMedia)"
                      :md="getIcon(socialMedia)"
                      size="large"
                      color="dark"
                    ></ion-icon>
                  </a>
                </template>
              </p>
            </template>
            <h2>Images:</h2>
            <p>
              <ion-grid>
                <ion-row>
                  <ion-col
                    size="12"
                    size-md="6"
                    size-lg="4"
                    size-xl="3"
                    v-for="image in eventDetails.images || []"
                    :key="image.url"
                    class="ion-padding-bottom"
                  >
                    <img
                      :src="image.url"
                      :alt="image.url"
                      class="h-100 w-100"
                    />
                  </ion-col>
                </ion-row>
              </ion-grid>
            </p>
          </div>
          <div class="ion-padding">
            <ion-button color="primary" @click="addToCalender">Add to Calender</ion-button>
            <ion-button color="light" @click="rejectEvent">Reject Event</ion-button>
          </div>
        </template>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonTitle,
  IonCard,
  IonIcon,
  IonChip,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import {
  logoYoutube,
  logoTwitter,
  logoInstagram,
  logoAppleAppstore,
  logoFacebook,
  wifiOutline,
} from "ionicons/icons";
import {secureStorage, presentToast} from '@/services/utils'
export default {
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonCard,
    IonIcon,
    IonChip,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
  },
  data() {
    return {
      eventDetails: {},
    };
  },
  created() {
    fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${this.$route.params.id}?apikey=02CT2Qgtn6XAEQwCqsPb2Hd7yXQZx19H`
    )
      .then((response) => response.json())
      .then((data) => {
        this.eventDetails = data;
      })
      .catch((error) => console.error(error));
  },
  methods: {
    getDate(val) {
      const dateObject = new Date(val);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        year: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter.format(dateObject);
      return formattedDate;
    },
    getIcon(socialMedia) {
      if (socialMedia == "itunes") {
        return logoAppleAppstore;
      } else if (socialMedia === "spotify") {
        return wifiOutline;
      } else if (socialMedia === "youtube") {
        return logoYoutube;
      } else if (socialMedia === "twitter") {
        return logoTwitter;
      } else if (socialMedia === "facebook") {
        return logoFacebook;
      } else if (socialMedia === "instagram") {
        return logoInstagram;
      }
    },
    rejectEvent() {
      let events = secureStorage().getItem("events");
      if (events) {
        events.rejectedEvents.push({ id: this.eventDetails.id, app: "ticketmaster" });
      } else {
        events = {
          rejectedEvents: [{ id: this.eventDetails.id, app: "ticketmaster" }],
          calenderEvents: [],
        };
      }
      presentToast("top", "Event Rejected", "danger");
      secureStorage().setItem("events", events);
      this.$router.push('/events')
    },
    addToCalender() {
      let events = secureStorage().getItem("events");
      if (events) {
        events.calenderEvents.push({
          id: this.eventDetails.id,
          app: "ticketmaster",
          name: this.eventDetails.name,
          url: this.eventDetails.url,
        });
        secureStorage().setItem("events", events);
      } else {
        events = {
          rejectedEvents: [],
          calenderEvents: [
            {
              id: this.eventDetails.id,
              app: "ticketmaster",
              name: this.eventDetails.name,
              url: this.eventDetails.url,
            },
          ],
        };
      }
      presentToast("top", "Event Added to Calender", "success");
      secureStorage().setItem("events", events);
      this.$router.push('/events')
    },
  },
};
</script>

<style scoped>
.event-image-container {
  text-align: center;
  margin: 20px 0;
}

.event-image-container img {
  width: 70%;
  height: auto;
}

.event-info-container {
  padding: 0px 20px;
}

.event-info-container h2 {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.event-info-container p {
  font-size: 16px;
  margin: 10px 0px;
}
@media (max-width: 600px) {
  .event-image-container img {
    width: 100%;
    height: auto;
  }
}
</style>
