import {createApp} from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './style.css'
import router from "./Router";
import { createPinia } from 'pinia'
import { userStore } from './Store/user'
import Skeleton from '@x-ui-vue3/skeleton'

const pinia = createPinia()
const app = createApp(App)
app.use(router).use(pinia).use(Skeleton).mount('#app')
const user = userStore()
user.restoreFromLocal()