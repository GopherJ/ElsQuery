import Vue from 'vue'
import App from './App.vue'
import ElsQuery from 'els-query'
import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(Vuex)

const store = new Vuex.Store();

Vue.use(ElsQuery, { store })

new Vue({
    render: h => h(App),
    store
}).$mount('#app')
