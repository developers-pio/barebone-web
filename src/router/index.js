import { createRouter, createWebHistory } from "@ionic/vue-router";
// Import the middleware functions
import { auth, guest, middlewarePipeline } from "@/middleware";
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
      layout: 'main',middleware: [auth]
    }
  },
  {
    path: "/event/:id",
    component: ()=> import("../views/EventDetails.vue"),
    name: 'EventDetials',
    meta: {
      layout: 'main',middleware: [auth]
    }
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
    name: 'Login',
    meta: { title: "Login", middleware: [guest] },
  },
  {
    path: "/profile",
    component: () => import("../views/Profile.vue"),
    name: 'Profile',
    meta: {
      layout: 'main',middleware: [auth]
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Barebone Aventis";

  if (!to.meta.middleware) {
    return next();
  }
  const middleware = to.meta.middleware;

  const context = {
    to,
    from,
    next,
  };

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
