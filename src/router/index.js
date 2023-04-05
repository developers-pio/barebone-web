import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [

  {
    path: "/events",
    component: ()=> import("../views/EventsList.vue"),
    name: 'Events'
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
    name: 'Login'
  },
  {
    path: "/profile",
    component: () => import("../views/profile/Profile.vue"),
    name: 'Profile'
  },
  // {
  //   path: "/basic-info",
  //   component: () => import("../views/profile/BasicInfoPage.vue"),
  //   name: 'Basic Info'
  // },
  // {
  //   path: "/calendar-page",
  //   component: () => import("../views/profile/CalendarPage.vue"),
  //   name: 'Calendar'
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
