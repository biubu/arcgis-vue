import { createApp } from 'vue'
import App from './App.vue'
import './main.css'

const app = createApp(App)
app.config.errorHandler = (err, _instance, info) => {
  console.error('Vue Error:', err, info)
}
app.mount('#app')
