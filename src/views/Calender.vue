<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">Calender</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="4" size-xl="3" v-for="event in calenderEvents || []" :key="event.id"
            class="ion-padding-bottom" style="box-shadow: none">
            <div button @click="$router.push(event?.extendedProperties?.shared?.eventUrlSlug)" class="ion-no-margin">
              <div class="event-image-container"
                :style="`background-image: url('${event?.extendedProperties?.shared?.eventImage}')`">
                <div class="event-name-container ion-justify-content-between ion-padding">
                  <div class="d-flex flex-column">
                    <h4 class="ion-no-margin">{{ event.summary }}</h4>
                    <div class="venue">{{ event?.extendedProperties?.shared?.venue ?
                      event?.extendedProperties?.shared?.venue : '' }}</div>
                    <div class="date">{{ getDate(event.start.dateTime, event.end.dateTime) }}</div>
                    <div class="time">{{ getTime(event.start.dateTime, event.end.dateTime) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <footer-component />
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonTitle } from "@ionic/vue";
import FooterComponent from "@/components/footer.vue";
// import { secureStorage } from "@/services/utils";
import loadScript from '@/Mixins/loadScript'
export default {
  name: "ProfilePage",
  mixins: [loadScript],
  components: {
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    FooterComponent
  },
  data() {
    return {
      calenderEvents: [],
    };
  },
  methods: {
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
    tConvert(time) {
      const datetime = new Date(time); // Replace with your datetime value

      const timeString = datetime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        hour12: true,
      });

      return timeString;
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
      if (venue.display_address) {
        return venue.display_address.join(", ");
      }
      let address = [];
      if (venue.address && venue.address.line1) {
        address.push(venue.address.line1);
      }
      if (venue.name) {
        address.push(venue.name);
      }
      if (venue.state || venue.city) {
        address.push(venue?.state?.name || venue?.city?.name || venue.city);
      }
      if (venue.country) {
        address.push(venue?.country?.countryCode || venue?.country);
      }
      return address.join(", ");
    },
    async listUpcomingEvents() {
      let response;

      try {
        const request = {
          calendarId: "primary",

          timeMin: new Date().toISOString(),

          showDeleted: false,

          singleEvents: true,

          maxResults: 10,

          orderBy: "startTime",
        };
        response = await window.gapi.client.calendar.events.list(request);
        this.calenderEvents = response?.result?.items || [];
      } catch (err) {
        return;
        // Please handle this case
      }
    },
    handleAuthClick() {
      window.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw resp;
        }

        document.getElementById("signout_button").style.visibility = "visible";

        document.getElementById("authorize_button").innerText = "Refresh";

        await this.listUpcomingEvents();
      };

      if (window.gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data

        // when establishing a new session.

        window.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        // Skip display of account chooser and consent dialog for an existing session.

        window.tokenClient.requestAccessToken({ prompt: "" });
      }
    },
    handleGoogleAuth() {
      if (window.gapi.client.getToken() === null) {
        window.window.tokenClient.requestAccessToken({ prompt: "consent" });
        document.addEventListener("on-getting-google-access-token", () => {
          this.listUpcomingEvents();
        })
      } else {
        this.listUpcomingEvents();
      }
    }
  },
  mounted() {
    // const events = secureStorage().getItem("events");
    // if (events && events.calenderEvents) {
    //   const calendersEvent = events.calenderEvents;
    //   this.calenderEvents = calendersEvent.sort((a, b) => {
    //     const aDate = a.date.split("-")[0];
    //     const bDate = b.date.split("-")[0];
    //     return new Date(aDate) - new Date(bDate);
    //   });
    // }
    // if (window.gapi.client.getToken() === null) {
    //   window.window.tokenClient.requestAccessToken({ prompt: "consent" });
    // } else {
    //   this.listUpcomingEvents();
    // }
    if (!window.gapi) {
      document.addEventListener("on-load-google-calander-scripts", this.handleGoogleAuth)
    } else {
      this.handleGoogleAuth()
    }
    // if (window?.gapi?.client?.getToken()) {
    //   this.listUpcomingEvents();
    // }
  },
  beforeUnmount() {
    document.removeEventListener("on-load-google-calander-scripts", this.handleGoogleAuth)
  }
};
</script>

<style scoped>
.event-image-container {

  height: 200px;

  border-radius: 25px;

  background-size: cover;

  background-position: center;

  position: relative;

}




.event-name-container {

  position: absolute;

  bottom: 0;

  left: 0;

  right: 0;

  background-color: rgba(0, 0, 0, 0.5);

  color: white;

  display: flex;

  gap: 5px;

  border-bottom-left-radius: 25px;

  border-bottom-right-radius: 25px;

}

.event-name-container h4 {

  color: var(--ion-color-light);

  margin-bottom: 5px;

  font-size: 15px;

}




.event-image-container .venue,

.event-image-container .date,

.event-image-container .time {

  margin-bottom: 2px;

  font-size: 12px;

}




.event-name-container ion-chip {

  --background: var(--ion-color-light);

  --color: var(--ion-color-dark);

}
</style>