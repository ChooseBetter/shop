import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import ui from "./components/library";
import "@/mock";

import "normalize.css";
import "@/assets/styles/common.less";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(ui);
app.use(router);
app.mount("#app");
