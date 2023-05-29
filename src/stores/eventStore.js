import { defineStore } from 'pinia'
export const eventStore = defineStore('event', {
    state: () => ({ 
      filter:{
        unit: 'km',
        endDateTime:'',
        startDateTime: '',
        radius: 25,
        radiusIndex: 1
      },
      currentEventIndex:0,
      totalPages:0,
      eventsList:[],
      geoLocation:{
        latitude: null,
        longitude:null
      }
   }),
    actions: {
      setFilter(filter){
        this.filter = filter
      },
      setCurrentIndex(index){
        this.currentEventIndex = index
      },
      setTotalPages(page){
        this.totalPages = page
      },
      setEventList(list){
        this.eventsList= list.sort((a,b)=>new Date(a.startDate) - new Date(b.startDate))
      },
      setLatLong(geoLocation){
        this.geoLocation = geoLocation
      }
    },
  })