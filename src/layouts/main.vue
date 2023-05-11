<template>
  <ion-split-pane content-id="main-content">
    <ion-menu content-id="main-content" type="overlay" menu-id="main-menu">
      <ion-content>
        <ion-img
          class="ion-padding-vertical main-logo"
          :src="require('@/assets/icons/logo.svg')"
        ></ion-img>
        <div class="ion-padding-horizontal">
        <h2>Filters</h2>
          <ion-row
            ><ion-col size="12">
              <ion-label>Radius</ion-label>
              <ion-range
                aria-label="Range with ticks"
                :dual-knobs="false"
                :pin="true"
                :ticks="true"
                :snaps="true"
                v-model="filter.radius"
                max="1000"
                Min="0"
                step="50"
              ></ion-range>
            </ion-col>
            <ion-col size="12" class="">
              <div class="d-flex">
              <ion-button style="width: 50%" shape="round" :fill="filter.unit === 'mi' ? 'solid' : 'outline'" @click="filter.unit = 'mi'">Miles</ion-button>
              <ion-button style="width: 50%" shape="round" :fill="filter.unit === 'km' ? 'solid' : 'outline'" @click="filter.unit = 'km'">Km</ion-button>
            </div>
            </ion-col>
            <ion-col size="12">
              <ion-datetime-button
                datetime="sdatetime"
                calss="dateTimeField"
                style="display: none"
                ><slot name="date-target"></slot
              ></ion-datetime-button>
              <ion-input
                v-model="filter.startDateTime"
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
                  v-model="filter.startDateTime"
                  presentation="date-time"
                  @ion-change="dismiss()"
                ></ion-datetime>
              </ion-modal>
            </ion-col>
            <ion-col size="12">
             

              <ion-datetime-button
                datetime="edatetime"
                calss="dateTimeField"
                style="display: none"
                ><slot name="date-target"></slot
              ></ion-datetime-button>
              <ion-input
                v-model="filter.endDateTime"
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
                  v-model="filter.endDateTime"
                  presentation="date-time"
                  @ion-change="dismiss()"
                ></ion-datetime>
              </ion-modal>
            </ion-col>
            <ion-col size="12">
              <ion-button color="primary"
            shape="round"
            expand="block" @click="applyFilter">Apply Filter</ion-button>
              <!-- <ion-button color="light" class="ion-margin-top"
            shape="round"
            expand="block" @click="resetFilter">Reset Filter</ion-button> -->
            </ion-col>
          </ion-row>
        </div>
      </ion-content>
    </ion-menu>
    <keep-alive>
      <ion-router-outlet id="main-content" :key="$route.fullPath"></ion-router-outlet>
    </keep-alive>
  </ion-split-pane>
</template>

<script>
import {
  IonContent,
  IonLabel,
  IonMenu,
  IonSplitPane,
  IonImg,
  IonRouterOutlet,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonRange,
  menuController
} from "@ionic/vue";
import { calendarOutline, personOutline, logOutOutline } from "ionicons/icons";
import { mapState, mapActions } from "pinia";
import { eventStore } from "@/stores/eventStore";
import { presentToast  } from '@/services/utils'

export default {
  name: "MainLayout",
  components: {
    IonContent,
    IonLabel,
    IonMenu,
    IonSplitPane,
    IonImg,
    IonRouterOutlet,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    IonRange,
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
      filter:{
        unit: 'mi'
      }
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
    ...mapActions(eventStore, ['setFilter']),
    signOut() {
        localStorage.removeItem('loggedIn')
        presentToast('top','Logged out Successfully','success')
        this.$router.push('/login')
    },
    applyFilter(){
      this.setFilter(Object.assign({},this.filter))
      menuController.toggle('main-menu')
    },
    // resetFilter(){
    //   this.filter={
    //     unit: 'mi',
    //     endDateTime:'',
    //     startDateTime: '',
    //     radius: 0,
    //   }
    //   this.dismiss()
    //   this.setFilter(Object.assign({},this.filter))
    // }
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
