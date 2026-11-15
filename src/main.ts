import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// ArcGIS 主题样式必须与 SDK 版本一致，本地导入（勿用 CDN 旧版本）
import '@arcgis/core/assets/esri/themes/light/main.css'
import './main.css'

const app = createApp(App)
app.use(router)
app.config.errorHandler = (err, _instance, info) => {
  console.error('Vue Error:', err, info)
}
app.mount('#app')
