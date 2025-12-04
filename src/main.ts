import {createApp} from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './style.css'
import router from "./Router";
import { createPinia } from 'pinia'


const app = createApp(App)
app.use(router).use(createPinia()).mount('#app')