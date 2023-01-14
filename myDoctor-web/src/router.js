import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Start from "./views/Start.vue";
import Login from "./views/Login.vue";
import Visit from "./views/Visit.vue";
import Doctor from "./views/Doctor.vue";
import Pantient from "./views/Pantient.vue";
import User from "./views/User.vue";
import Schedule from "./views/Schedule.vue";
import NotFound from "./views/NotFound.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "start",
      component: Start
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },

    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/visit",
      name: "visit",
      component: Visit,
      children: [
        {
          path: ':id',
          component: Visit
        }
      ],
    },
    {
      path: "/doctor",
      name: "doctor",
      component: Doctor,
      children: [
        {
          path: ':id',
          component: Doctor
        }
      ]
    },
    {
      path: "/pantient",
      name: "pantient",
      component: Pantient,
      children: [
        {
          path: ':id',
          component: Pantient
        }
      ],
    },
    {
      path: "/register",
      name: "user",
      component: User
    },
    {
      path: "/schedule",
      name: "schedule",
      component: Schedule
    },
    {
      path: "/404",
      name: "404",
      component: NotFound
    },
    { path: '*', redirect: '/404' },
  ],
});
