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
              <img :src="eventDetails?.image_url" alt="Event Image" />
            </div>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="idCardOutline"
              ></ion-icon>
              <ion-label style="white-space: pre-wrap">{{
                eventDetails.title
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
                v-if="eventDetails.venue"
              >
                {{ getVenue(eventDetails.venue) }}
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-end ion-margin-start"
                slot="start"
                :icon="informationCircleOutline"
              ></ion-icon>
              <ion-label style="white-space: pre-wrap">
                {{ eventDetails.description }}
              </ion-label>
            </ion-item>

            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="calendarClearOutline"
              ></ion-icon>
              <div class="d-flex ion-padding-vertical" style="flex-direction: column;padding: 10px 0px;">
                <ion-label>
                  {{ getDate(eventDetails.startDate, eventDetails.endDate) }}
                </ion-label>
                <ion-button shape="round" color="primary" size="medium" @click="addToCalender" v-if="!actionAlreadyDone"
                >Add to Calender</ion-button
              >
              </div>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="timeOutline"
              ></ion-icon>
              <ion-label>
                {{ getTime(eventDetails.startDate, eventDetails.endDate) }}
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
            <ion-item class="ion-no-padding" v-if="eventDetails.tags">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="pricetagOutline"
              ></ion-icon>
              <ion-label style="white-space: pre-wrap">
                {{ eventDetails.tags.length ? eventDetails.tags.join(" ") : 'NA' }}
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="personCircleOutline"
              ></ion-icon>
              <ion-label>
                {{ eventDetails.promoter || 'NA' }}
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding">
              <ion-icon
                class="ion-margin-start ion-margin-end"
                slot="start"
                :icon="cashOutline"
              ></ion-icon>
              <ion-label>
                {{ eventDetails.price || 'NA' }}
              </ion-label>
            </ion-item>
          </div>
          <div class="ion-padding">
            <ion-button shape="round" color="light" class="w-100" @click="rejectEvent" v-if="!actionAlreadyDone"
              >Not for me</ion-button
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
  IonButton,
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
import axios from "@/service";
import { eventQuery } from "@/constant";
export default {
  components: {
    IonPage,
    IonContent,
    IonBackButton,
    IonCard,
    IonIcon,
    IonButton,
    FooterComponent,
    IonItem,
    IonTitle,
    IonLabel,
  },
  data() {
    return {
      eventDetails: {},
      actionAlreadyDone: false,
      locationOutline,
      informationCircleOutline,
      idCardOutline,
      calendarClearOutline,
      personCircleOutline,
      timeOutline,
      linkOutline,
      cashOutline,
      pricetagOutline,
    };
  },
  async created() {
    try {
      if (this.$route.params.from === "tm") {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events/${this.$route.params.id}?apikey=02CT2Qgtn6XAEQwCqsPb2Hd7yXQZx19H`
        );

        this.eventDetails = {
          id: data.id,
          title: data.name,
          startDate:
            data?.dates?.start?.dateTime ||
            data?.dates?.start?.localDate ||
            null,
          endDate:
            data?.dates?.end?.dateTime || data?.dates?.end?.localDate || null,
          venue: data?._embedded?.venues?.[0] || data?.place || {},
          image_url: this.getImage(data?.images || []),
          distance: data.distance ? `${data.distance} ${data.units}` : null,
          description: data?.info || data?.description || "NA",
          url: data.url,
          tags: (data.classifications || []).reduce((tags, classification) => {
            if (
              classification.genre &&
              classification?.genre?.name !== "Undefined"
            ) {
              tags.push("#" + classification?.genre?.name);
            }
            if (
              classification.segment &&
              classification?.segment?.name !== "Undefined"
            ) {
              tags.push("#" + classification?.segment?.name);
            }
            if (
              classification.subGenre &&
              classification?.subGenre?.name !== "Undefined"
            ) {
              tags.push("#" + classification?.subGenre?.name);
            }
            if (
              classification.type &&
              classification?.type?.name !== "Undefined"
            ) {
              tags.push("#" + classification?.type?.name);
            }
            return tags;
          }, []),
          price: data.priceRanges
            ? this.getCurrency(data?.priceRanges?.[0] || {})
            : "NA",
          promoter: data?.promoter?.name || "NA",
          images: data.images,
          from: "tm",
        };
      } else if (this.$route.params.from === "mu") {
        const { data } = await axios.post("https://barebone-aventis.programmers.us/meetup.php", {
          query: eventQuery(this.$route.params.id)
        });
        this.eventDetails = {
          id: data?.data?.event?.id,
          title: data?.data?.event?.title,
          startDate: data?.data?.event?.dateTime,
          endDate: data?.data?.event?.endDate,
          venue: data?.data?.event?.venue || {},
          image_url: data?.data?.event?.imageUrl || null,
          description: data?.data?.event?.description || "NA",
          url: data?.data?.event?.eventUrl || null,
          tags: (data?.data?.event?.topics?.edges || []).reduce((tags, topic) => {
            tags.push("#" + topic?.node?.name);
            return tags;
          }, []),
          price: data.priceRanges
            ? this.getCurrency(data?.priceRanges?.[0] || {})
            : "NA",
          promoter: data?.data?.event?.host?.name || "NA",
          from: "mu",
        };
      }
      const events = secureStorage().getItem("events");
      if (events && events.calenderEvents) {
        this.actionAlreadyDone = events.calenderEvents.some(
          (event) => event.id === this.eventDetails.id
        );
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    getCurrency(currencyObject) {
      let ticketPriceRange = "";
      if (currencyObject && currencyObject.min) {
        ticketPriceRange += currencyObject.min;
      }
      if (currencyObject && currencyObject.max) {
        ticketPriceRange += ` - ${currencyObject.max}`;
      }
      if (currencyObject.currency && ticketPriceRange) {
        ticketPriceRange += ` ${currencyObject.currency}`;
      }
      return ticketPriceRange;
    },
    getDate(startDate, endDate) {
      let date = "";
      if (startDate) {
        date += this.dConvert(startDate);
      }
      if (endDate) {
        date += ` - ${this.dConvert(endDate)}`;
      }
      return date;
    },
    getTime(startTime, endTime) {
      let date = "";
      if (startTime) {
        date += this.tConvert(startTime);
      }
      if (endTime) {
        date += ` - ${this.tConvert(endTime)}`;
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
    getVenue(venue) {
      let address = [];
      if(venue.address && venue.address.line1){
        address.push(venue.address.line1)
      }
      if (venue.name) {
        address.push(venue.name)
      }
      if (venue.state || venue.city) {
        address.push(venue?.state?.name || venue?.city?.name || venue.city)
      }
      if (venue.country) {
        address.push(venue?.country?.countryCode || venue?.country)
      }
      return address.join(', ');
    },
    tConvert(time) {
      const datetime = new Date(time); // Replace with your datetime value

      const timeString = datetime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      return timeString;
    },
    getImage(images) {
      const image = images.reduce((prev, current) => {
        const prevResolution = prev.width * prev.height;
        const currentResolution = current.width * current.height;

        return currentResolution > prevResolution ? current : prev;
      });
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
          from: this.eventDetails.from
        });
      } else {
        events = {
          rejectedEvents: [{ id: this.eventDetails.id, from: this.eventDetails.from }],
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
        events.calenderEvents.push(this.eventDetails);
        secureStorage().setItem("events", events);
      } else {
        events = {
          rejectedEvents: [],
          calenderEvents: [
            this.eventDetails
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
