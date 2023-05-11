<template>
  <ion-page>
    <ion-content>
      <div class="d-flex">
        <ion-back-button class="" defaultHref="/events"></ion-back-button>
        <ion-title class="ion-text-center">Details</ion-title>
      </div>
      <ion-card class="ion-no-margin">
        <template v-if="Object.keys(eventDetails).length">
          <div class="event-info-container">
            <div class="event-image-container">
              <img :src="eventDetails?.images[0]?.url" alt="Event Image" />
            </div>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="idCardOutline"
              ></ion-icon>
              <ion-label style="white-space: pre-wrap">{{
                eventDetails.name
              }}</ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-end ion-margin-start"
                slot="start"
                :icon="locationOutline"
              ></ion-icon>
              <ion-label
                style="white-space: pre-wrap"
                v-if="eventDetails._embedded && eventDetails._embedded.venues"
              >
                {{
                  getVenue(eventDetails)
                }}
              </ion-label>
              <ion-label style="white-space: pre-wrap" v-if="eventDetails.place">
                {{
                  eventDetails.place.address
                    ? eventDetails.place.address.line1
                    : "NA"
                }}
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-end ion-margin-start"
                slot="start"
                :icon="informationCircleOutline"
              ></ion-icon>
              <ion-label style="white-space: pre-wrap">
                {{ eventDetails.info || eventDetails.description || "NA" }}
              </ion-label>
            </ion-item>

            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="calendarClearOutline"
              ></ion-icon>
              <ion-label>
                {{ getDate(eventDetails.dates || {}) }}
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="timeOutline"
              ></ion-icon>
              <ion-label>
                {{ getTime(eventDetails.dates || {}) }}
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="linkOutline"
              ></ion-icon>
              <ion-label style="white-space: pre-wrap">
                <a
                  v-if="eventDetails.url"
                  :href="eventDetails.url"
                  target="_blank"
                >
                  {{ eventDetails.url }}</a
                >
                <span v-else>NA</span>
              </ion-label>
            </ion-item>
            <ion-item
              class="ion-no-padding"
              v-if="eventDetails.classifications"
            >
            <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="pricetagOutline"
              ></ion-icon>
              <div
                class="d-flex" style="gap:10px;"
                v-for="(
                  classification, index
                ) in eventDetails.classifications || []"
                :key="`classification-${index}`"
              >
                <ion-text
                  color="dark"
                  style="marin:0px 5px;"
                  v-if="
                    classification.segment &&
                    classification.segment.name != 'Undefined'
                  "
                  >#{{ classification.segment.name }}</ion-text
                >
                <ion-text
                  color="dark"
                  style="marin:0px 5px;"
                  v-if="
                    classification.genere &&
                    classification.genere.name != 'Undefined'
                  "
                  >#{{ classification.genre.name }}</ion-text
                >
                <ion-text
                  color="dark"
                  style="marin:0px 5px;"
                  v-if="
                    classification.subGenre &&
                    classification.subGenre.name != 'Undefined'
                  "
                  >#{{ classification.subGenre.name }}</ion-text
                >
                <ion-text
                  color="dark"
                  style="marin:0px 5px;"
                  v-if="
                    classification.type &&
                    classification.type.name != 'Undefined'
                  "
                  >#{{ classification.type.name }}</ion-text
                >
                <ion-text
                  color="dark"
                  style="marin:0px 5px;"
                  v-if="
                    classification.subType &&
                    classification.subType.name != 'Undefined'
                  "
                  >#{{ classification.subType.name }}</ion-text
                >
              </div>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="personCircleOutline"
              ></ion-icon>
              <ion-label>
                {{ eventDetails?.promoter?.name || "NA" }}
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="cashOutline"
              ></ion-icon>
              <ion-label>
                {{
                  eventDetails.priceRanges && eventDetails.priceRanges[0] && (eventDetails.priceRanges[0].min || eventDetails.priceRanges[0].max)
                    ? `${eventDetails.priceRanges[0].min} - ${eventDetails.priceRanges[0].max} ${eventDetails.priceRanges[0].currency}`
                    : "NA"
                }}
              </ion-label>
            </ion-item>
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
          </div>
          <div class="ion-padding">
            <ion-button shape="round" color="light" @click="rejectEvent"
              >Not for me</ion-button
            >
            <ion-button shape="round" color="primary" @click="addToCalender"
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
  IonText,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonTitle,
  IonLabel,
} from "@ionic/vue";
import {
  locationOutline,
  informationCircleOutline,
  idCardOutline,
  calendarClearOutline,
  personCircleOutline,
  timeOutline,
  linkOutline,
cashOutline,
pricetagOutline,
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
    IonText,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    FooterComponent,
    IonItem,
    IonTitle,
    IonLabel,
  },
  data() {
    return {
      eventDetails: {},
      locationOutline,
      informationCircleOutline,
      idCardOutline,
      calendarClearOutline,
      personCircleOutline,
      timeOutline,
      linkOutline,
      cashOutline,
      pricetagOutline
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
    getDate(dates) {
      let date = "";
      if (dates.start && (dates.start.dateTime || dates.start.localDate)) {
        date += this.dConvert(dates.start.dateTime || dates.start.localDate);
      }
      if (dates.end && (dates.end.dateTime || dates.end.localDate)) {
        date += `- ${this.dConvert(dates.end.dateTime || dates.end.localDate)}`;
      }
      return date;
    },
    getTime(dates) {
      let date = "";
      if (dates.start && dates.start.localTime) {
        date += this.tConvert(dates.start.localTime);
      }
      if (dates.end && dates.end.localTime) {
        date += `- ${this.tConvert(dates.end.localTime)}`;
      }
      return date;
    },
    dConvert(val) {
      const dateObject = new Date(val);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter.format(dateObject);
      return formattedDate;
    },
    getVenue(event) {
      const venue = event?._embedded?.venues?.[0] || {};
      let address = "";
      if (venue.name) {
        address += `${venue.name}`;
      }
      if (venue.state) {
        address += `, ${venue.state.name}`;
      }
      if (venue.country) {
        address += `, ${venue.country.countryCode}`;
      }
      return address;
    },
    tConvert(time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join(""); // return adjusted time or original string
    },
    getImage(event) {
      const image = event.images
        ? event.images.reduce((prev, current) => {
            const prevResolution = prev.width * prev.height;
            const currentResolution = current.width * current.height;

            return currentResolution > prevResolution ? current : prev;
          })
        : {};
      return image?.url || "";
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
  margin: 10px 0;
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
