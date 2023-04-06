<template>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay" menu-id="main-menu">
        <ion-content>
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
  IonRouterOutlet
} from "@ionic/vue";
import { calendarOutline, personOutline, logOutOutline } from "ionicons/icons";

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
    IonRouterOutlet
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
    layout() {
      return `${this.$route.meta.layout || "default"}-layout`;
    },
  },
  methods: {
    signOut() {
        localStorage.removeItem('loggedIn')
        this.$router.push('/login')
    }
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