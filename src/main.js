import Vue from 'vue'
import App from './App.vue'
import Listener from './Listener'

Vue.config.productionTip = false

window.listner = new Listener(4321)

new Vue({
  render: h => h(App),
}).$mount('#app')
