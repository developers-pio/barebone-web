<template>
  <ion-split-pane content-id="main-content">
    <ion-menu content-id="main-content" type="overlay" menu-id="main-menu">
      <ion-content v-if="menu.name === 'filter' && menu.active">
        <ion-img
          class="ion-padding-bottom main-logo"
          :src="require('@/assets/icons/logo.svg')"
        ></ion-img>
        filters
        <div>
          <ion-row
            ><ion-col size="12">
              <ion-input
                aria-label="Radius"
                placeholder="Radius"
                type="text"
                fill="outline"
                autocomplete="none"
                class="custom-filter"
              ></ion-input>

              <!-- <span
                      slot="error"
                      v-if="errors.email"
                      style="color: white; padding-left: 15px"
                      >{{ errors.email }}</span
                    > -->
            </ion-col>
            <ion-col size="12">
              <ion-select
                aria-label="Units"
                interface="popover"
                placeholder="Units"
              >
                <ion-select-option value="Miles">Miles</ion-select-option>
                <ion-select-option value="KM">KM</ion-select-option>
                <ion-select-option value="none">none</ion-select-option>
              </ion-select>

              <!-- <span
            slot="error"
            v-if="errors.email"
            style="color: white; padding-left: 15px"
            >{{ errors.email }}</span
          > -->
            </ion-col>
            <ion-col size="12">
              <!-- <label class="labelClassProfile">S </label> -->

              <ion-datetime-button
                datetime="sdatetime"
                calss="dateTimeField"
                style="display: none"
                ><slot name="date-target"></slot
              ></ion-datetime-button>
              <ion-input
                aria-label="startdate"
                placeholder="Start Date Time"
                type="text"
                id="open-modal-start-date"
                fill="outline"
                autocomplete="none"
                :readonly="true"
                class="custom-filter"
              ></ion-input>

              <ion-modal
                ref="modal1"
                trigger="open-modal-start-date"
                :keep-contents-mounted="true"
              >
                <ion-datetime
                  id="sdatetime"
                  presentation="date-time"
                  @ion-change="dismiss()"
                ></ion-datetime>
              </ion-modal>
            </ion-col>
            <ion-col size="12">
             

              <ion-datetime-button
                datetime="endDate"
                calss="dateTimeField"
                style="display: none"
                ><slot name="date-target"></slot
              ></ion-datetime-button>
              <ion-input
                aria-label="endDate"
                placeholder="End Date Time"
                type="text"
                id="open-modal-end-date"
                fill="outline"
                autocomplete="none"
                :readonly="true"
                class="custom-filter"
              ></ion-input>

              <ion-modal
                ref="modal2"
                trigger="open-modal-end-date"
                :keep-contents-mounted="true"
              >
                <ion-datetime
                  id="edatetime"
                  presentation="date-time"
                  @ion-change="dismiss()"
                ></ion-datetime>
              </ion-modal>
            </ion-col>
            <ion-col size="12">
              <ion-select
                aria-label="Units"
                interface="popover"
                placeholder="Include Family"
                
              >
                <ion-select-option value="Yes">Yes</ion-select-option>
                <ion-select-option value="No">No</ion-select-option>
                <ion-select-option value="Only">Only</ion-select-option>
                <ion-select-option value="none">none</ion-select-option>
              </ion-select>

              <!-- <span
            slot="error"
            v-if="errors.email"
            style="color: white; padding-left: 15px"
            >{{ errors.email }}</span
          > -->
            </ion-col>
            <ion-col size="12">
              <ion-button color="primary"
            shape="round"
            expand="block">Apply Filter</ion-button>
            </ion-col>
          </ion-row>
        </div>
      </ion-content>
      <ion-content v-else>
        <ion-list id="inbox-list" class="ion-padding-bottom">
          <ion-img
            class="ion-padding-bottom main-logo"
            :src="require('@/assets/icons/logo.svg')"
          ></ion-img>

          <ion-menu-toggle
            auto-hide="false"
            v-for="(p, i) in appPages"
            :key="i"
          >
            <ion-item
              @click="selectedIndex = i"
              router-direction="root"
              :router-link="p.url"
              lines="none"
              detail="false"
              class="hydrated"
              :class="{ selected: selectedIndex === i }"
            >
              <ion-icon
                aria-hidden="true"
                slot="start"
                :ios="p.iosIcon"
                :md="p.mdIcon"
              ></ion-icon>
              <ion-label>{{ p.title }}</ion-label>
            </ion-item>
          </ion-menu-toggle>
          <ion-item
            @click="signOut"
            lines="none"
            detail="false"
            class="hydrated"
          >
            <ion-icon
              aria-hidden="true"
              slot="start"
              :ios="logOutOutline"
              :md="logOutOutline"
            ></ion-icon>
            <ion-label>Sign Out</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-split-pane>
</template>

<script>
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonSplitPane,
  IonImg,
  IonRouterOutlet,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonModal
  // IonRow,
  // IonCol,
  // IonInput
} from "@ionic/vue";
import { calendarOutline, personOutline, logOutOutline } from "ionicons/icons";
import { mapState, mapActions } from "pinia";
import { eventStore } from "@/stores/eventStore";

export default {
  name: "MainLayout",
  components: {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
    IonSplitPane,
    IonImg,
    IonRouterOutlet,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonDatetimeButton,
    IonModal
    // IonRow,
    // IonCol,
    // IonInput
  },
  data() {
    return {
      selectedIndex: 0,
      appPages: [
        {
          title: "Events",
          url: "/events",
          iosIcon: calendarOutline,
          mdIcon: calendarOutline,
        },
        {
          title: "Profile",
          url: "/profile",
          iosIcon: personOutline,
          mdIcon: personOutline,
        },
      ],
      logOutOutline,
      labels: ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"],
    };
  },
  mounted() {
    const name = this.$route.name;
    if (name !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === name.toLowerCase()
      );
    }
  },
  computed: {
    ...mapState(eventStore, ["menu"]),
    layout() {
      return `${this.$route.meta.layout || "default"}-layout`;
    },
  },
  methods: {
    dismiss() {
      this.$refs.modal1.$el.dismiss();
      this.$refs.modal2.$el.dismiss();
    },
    ...mapActions(eventStore, ["setMenu"]),
    signOut() {
      localStorage.removeItem("loggedIn");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
  cursor: pointer;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
