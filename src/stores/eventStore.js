import { defineStore } from 'pinia'
export const eventStore = defineStore('event', {
    state: () => ({ 
      menu: {name:'navigation',active:false},
      filter:{},
      currentEventIndex:17,
      totalPages:0
   }),
    actions: {
      setMenu(menu){
        if(menu.name==='filter' && menu.active===false){
          this.menu = {name:'navigation',active:true}
        }else if(menu.name==='filter' && menu.active===true){
          this.menu={name:'filter',active:true}
        }else if(menu.name==='navigation'){
          this.menu = menu
        }
      },
      setFilter(filter){
        this.filter = filter
      },
      setCurrentIndex(index){
        this.currentEventIndex = index
      },
      setTotalPages(page){
        this.totalPages = page
      }
    },
  })