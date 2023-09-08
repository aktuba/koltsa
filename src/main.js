import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import drag from "v-drag";

createApp(App).use(drag).mount('#app')
