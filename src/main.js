import {createApp} from "vue";
import App from "./App.vue";
import "@/styles/normalize.css";
import "@/styles/hover-min.css";
import "@/styles/index.scss";
import "element-plus/theme-chalk/src/message.scss"
import 'element-plus/theme-chalk/dark/css-vars.css'
import router from '@/router';
import {createPinia} from 'pinia';
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.use(VueLoaders)
app.mount("#app");
