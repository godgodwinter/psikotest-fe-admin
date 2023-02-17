import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// import './assets/main.css'
import "./style.css";

// library fixed
import VueGoodTablePlugin from "vue-good-table-next";

// style
import "vue-good-table-next/dist/vue-good-table-next.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueGoodTablePlugin);

app.mount("#app");
