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
    component: () => import("../views/Profile.vue"),
    name: 'Profile'
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
