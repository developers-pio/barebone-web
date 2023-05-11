<template>
  <div id="ec" class="ion-margin-top"></div>
</template>

<script>
import Calendar from "@event-calendar/core";
import DayGrid from "@event-calendar/day-grid";
import "@event-calendar/core/index.css";
import {secureStorage} from '@/services/utils'
export default {
  mounted() {
    const events = secureStorage().getItem('events')
    let calendarEvents = []
    if(events && events.calenderEvents){
      calendarEvents = events.calenderEvents.map(event=>{
        const data = { title: event.title, url:event.url, titleHTML:`<a class="event-link" href="${event.url}" target="_blank" >${event.title}</a>` }
        if(event?.start?.localDate || false){
          data.start = event?.start?.localDate
        }
        if(event?.end?.localDate || false){
          data.end = event?.end?.localDate
        }else{
           data.end = event?.start?.localDate
        }
        return data
      })
    }
    new Calendar({
      target: document.getElementById("ec"),
      props: {
        plugins: [DayGrid],
        options: {
          view: "dayGridMonth",
          events: calendarEvents,
        },
      },
    });
  },

  name: "CalenderPage",
};
</script>
