import { createApp } from 'vue'
import {
  ElButton,
  ElCheckbox,
  ElDialog,
  ElInput,
  ElOption,
  ElProgress,
  ElSelect,
  ElTabPane,
  ElTabs,
} from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/base.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(ElButton)
app.use(ElCheckbox)
app.use(ElDialog)
app.use(ElInput)
app.use(ElOption)
app.use(ElProgress)
app.use(ElSelect)
app.use(ElTabPane)
app.use(ElTabs)
app.mount('#app')

