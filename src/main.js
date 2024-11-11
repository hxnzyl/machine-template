import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'normalize.css/normalize.css'
import 'element-ui/packages/theme-chalk/src/index.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
	render: (h) => h(App)
}).$mount('#app')
