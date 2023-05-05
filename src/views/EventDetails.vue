<template>
  <ion-page>
    <ion-content>
      <div class="d-flex">
        <ion-back-button class="" defaultHref="/events"></ion-back-button>
        <ion-title class="ion-text-center">Details</ion-title>
      </div>
      <ion-card>
        <template v-if="Object.keys(eventDetails).length">
          <div class="event-image-container">
            <img :src="eventDetails?.images[0]?.url" alt="Event Image" />
          </div>
          <ion-item class="ion-no-padding">
              <ion-icon class="ion-margin-end ion-margin-start" :icon="locationOutline"></ion-icon>
              <ion-label style="white-space: pre-wrap;">
                {{
                  eventDetails._embedded.venues[0]
                    ? `${
                        eventDetails?._embedded?.venues[0]?.address?.line1 || ""
                      }, ${
                        eventDetails?._embedded?.venues[0]?.city?.name || ""
                      }, ${
                        eventDetails?._embedded?.venues[0]?.state?.name || ""
                      }, ${
                        eventDetails?._embedded?.venues[0]?.country?.name || ""
                      }`
                    : "NA"
                }}
              </ion-label>
          </ion-item>
          <ion-item class="ion-no-padding">
              <ion-icon class="ion-margin-end ion-margin-start" :icon="informationCircleOutline"></ion-icon>
              <ion-label style="white-space: pre-wrap;">
                {{ eventDetails.info || "NA" }}
              </ion-label>
          </ion-item>
          <div class="event-info-container">
            <ion-item class="ion-no-padding">
              <ion-icon class="ion-margin-start ion-margin-end" :icon="micOutline"></ion-icon>
              <ion-label style="white-space: pre-wrap;">{{ eventDetails.name }}</ion-label>
            </ion-item>
            <!-- <h2>Event Name:</h2> -->

            <ion-item>
            <ion-icon class="ion-margin-start ion-margin-end" :icon="calendarClearOutline"></ion-icon>
            <ion-label>
              {{
                getDate(
                  eventDetails.dates.start.dateTime ||
                    eventDetails.dates.start.localDate
                )
              }}
            </ion-label>
          </ion-item>
            <ion-item>
            <h2>#</h2>
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
                >#{{ classification.segment.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.genere &&
                  classification.genere.name != 'Undefined'
                "
                >#{{ classification.genre.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.subGenre &&
                  classification.subGenre.name != 'Undefined'
                "
                >#{{ classification.subGenre.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.type && classification.type.name != 'Undefined'
                "
                >#{{ classification.type.name }}</ion-chip
              >
              <ion-chip
                v-if="
                  classification.subType &&
                  classification.subType.name != 'Undefined'
                "
                >#{{ classification.subType.name }}</ion-chip
              >
            </div>
          </ion-item>
            <!-- <h2>Info:</h2>
            <p>
              {{ eventDetails.info || "NA" }}
            </p> -->
            <ion-item>
              <ion-icon class="ion-margin-start ion-margin-end" :icon="personRemoveOutline"></ion-icon>
              <ion-label>
                {{ eventDetails?.promoter?.name || "NA" }}
              </ion-label>
            </ion-item>
            <!-- <h2>Promoter:</h2> -->
            <h2>$:</h2>
            <p>
              {{
                eventDetails.priceRanges && eventDetails.priceRanges[0]
                  ? `${eventDetails.priceRanges[0].min} - ${eventDetails.priceRanges[0].max} ${eventDetails.priceRanges[0].currency}`
                  : "NA"
              }}
            </p>
            <template v-if="eventDetails._embedded.venues">
              <!-- <h2>Venue Name:</h2>
              <p>
                {{ eventDetails?._embedded?.venues[0]?.name || "" }}
              </p> -->
              <!-- <h2>Venue Location:</h2>
              <p>
                {{
                  eventDetails._embedded.venues[0]
                    ? `${
                        eventDetails?._embedded?.venues[0]?.address?.line1 || ""
                      }, ${
                        eventDetails?._embedded?.venues[0]?.city?.name || ""
                      }, ${
                        eventDetails?._embedded?.venues[0]?.state?.name || ""
                      }, ${
                        eventDetails?._embedded?.venues[0]?.country?.name || ""
                      }`
                    : "NA"
                }}
              </p> -->
              <!-- <h2>Venue Info:</h2>
              <p>
                {{ eventDetails.pleaseNote || "NA" }}
              </p> -->
            </template>
            <template
              v-if="
                eventDetails._embedded.attractions &&
                eventDetails?._embedded?.attractions[0]
              "
            >
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
            <ion-button shape="round" color="light">Not for me</ion-button>
            <ion-button shape="round" color="primary"
              >Add to Calender</ion-button
            >
          </div>
        </template>
      </ion-card>
    </ion-content>
    <footer-component />
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonBackButton,
  IonContent,
  IonCard,
  IonIcon,
  IonChip,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonTitle,
} from "@ionic/vue";
import { locationOutline, informationCircleOutline, micOutline, calendarClearOutline, personRemoveOutline } from "ionicons/icons";
import {
  logoYoutube,
  logoTwitter,
  logoInstagram,
  logoAppleAppstore,
  logoFacebook,
  wifiOutline,
} from "ionicons/icons";
import FooterComponent from "@/components/footer.vue";
import { secureStorage, presentToast } from "@/services/utils";
export default {
  components: {
    IonPage,
    IonContent,
    IonBackButton,
    IonCard,
    IonIcon,
    IonChip,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    FooterComponent,
    IonItem,
    IonTitle,
  },
  data() {
    return {
      eventDetails: {},
      locationOutline,
      informationCircleOutline,
      micOutline,
      calendarClearOutline,
      personRemoveOutline
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
      console;
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
        events.rejectedEvents.push({
          id: this.eventDetails.id,
          app: "ticketmaster",
        });
      } else {
        events = {
          rejectedEvents: [{ id: this.eventDetails.id, app: "ticketmaster" }],
          calenderEvents: [],
        };
      }
      presentToast("top", "Event Rejected", "danger");
      secureStorage().setItem("events", events);
      this.$router.push("/events");
    },
    addToCalender() {
      let events = secureStorage().getItem("events");
      if (events) {
        events.calenderEvents.push({
          id: this.eventDetails.id,
          app: "ticketmaster",
          title: this.eventDetails.name,
          url: this.eventDetails.url,
          start: this.eventDetails?.dates?.start || {},
          end: this.eventDetails?.dates?.end || {},
        });
        secureStorage().setItem("events", events);
      } else {
        events = {
          rejectedEvents: [],
          calenderEvents: [
            {
              id: this.eventDetails.id,
              app: "ticketmaster",
              title: this.eventDetails.name,
              url: this.eventDetails.url,
              start: this.eventDetails?.dates?.start || {},
              end: this.eventDetails?.dates?.end || {},
            },
          ],
        };
      }
      presentToast("top", "Event Added to Calender", "success");
      secureStorage().setItem("events", events);
      this.$router.push("/events");
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
  padding: 0px 5px;
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
