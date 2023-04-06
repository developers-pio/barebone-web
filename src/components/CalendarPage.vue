<template>
  <div id="ec" class="ion-margin-top"></div>
</template>

<script>
// import {

//     IonPage,

// } from "@ionic/vue";
import Calendar from "@event-calendar/core";
import DayGrid from "@event-calendar/day-grid";
import "@event-calendar/core/index.css";
export default {
  mounted() {
    let ec = new Calendar({
      target: document.getElementById("ec"),
      props: {
        plugins: [DayGrid],
        options: {
          view: "dayGridMonth",
          eventClick:this.handleDateClick,
          events: [
            { start: "2023-04-07", title: "Long Event",url:"www.google.com",titleHTML:'<a class="event-link" href="https://www.google.com" target="_blank" >LongEvent</a>' },
          ],
        },
      },
    });
    console.log(ec);
  },

  name: "CalenderPage",
  components: {
    // IonPage,
  },
  methods:{
    handleDateClick(e){
        console.log(e)
    }
  }
};
</script>
