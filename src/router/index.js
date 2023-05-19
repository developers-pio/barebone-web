import { createRouter, createWebHistory } from "@ionic/vue-router";
// Import the middleware functions
const routes = [
  {
    path: "",
    redirect:'/events'
  },
  {
    path: "/events",
    component: ()=> import("../views/EventsList.vue"),
    name: 'Events',
    meta: {
      layout: 'main'
    }
  },
  {
    path: "/event/:from/:id",
    component: ()=> import("../views/EventDetails.vue"),
    name: 'EventDetails',
    meta: {
      layout: 'main'
    }
  },
  {
    path: "/calender",
    component: () => import("../views/Calender.vue"),
    name: 'Calender',
    meta: {
      layout: 'main'
    }
  },
  {
    path: '/:catchAll(.*)',
    component: () => import("../views/NotFound.vue"),
    name: '404'
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Barebone Aventis";
  return next();
});

export default router;
