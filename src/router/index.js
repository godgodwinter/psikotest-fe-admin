import { createRouter, createWebHistory } from "vue-router";
import Toast from "@/components/lib/Toast";
import LandingRoutes from "./LandingRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import UjianStudiRoutes from "./UjianStudiRoutes";
import AdminSekolahRoutes from "./mastering/sekolah-routes";
// import ExampleRoutes from "./ExampleRoutes";

const routes = [];
routes.push(
  // ...ExampleRoutes,
  ...UserRoutes,
  ...AdminRoutes,
  ...AdminSekolahRoutes,
  ...UjianStudiRoutes,
  ...LandingRoutes
);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // middleware login
  if (
    to.matched.some((record) => record.meta.requireAuth) &&
    !localStorage.getItem("isLogin")
  ) {
    // 1.periksa apakah token valid
    // 2. jikat tidak valid maka remove localstorage
    // 3. pergi kemenu login
    Toast.babeng("Info", "Silahkan Login terlebih dahulu!");
    // console.log("belum login");
    // next("/login");
    next({ name: "Login" });
    // console.log(to);
    // next({ name: "login", query: { next: to.fullPath } });
  } else {
    next();
  }
});

export default router;
