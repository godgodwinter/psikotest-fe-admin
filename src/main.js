import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// import './assets/main.css'
import "./style.css";

// library fixed
import VueGoodTablePlugin from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "vue-select/dist/vue-select.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// import { VueSelect } from "vue-select";
import vSelect from "vue-select";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaFlag, RiZhihuFill, IoApps, IoMenu } from "oh-vue-icons/icons";
addIcons(FaFlag, RiZhihuFill, IoApps, IoMenu);

// style

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueGoodTablePlugin);
app.use(VueQueryPlugin);
// app.use(VueSelect)
app.component("v-select", vSelect);
app.component("QuillEditor", QuillEditor);
app.component("VueDatePicker", VueDatePicker);
app.component("v-icon", OhVueIcon);

app.mount("#app");
