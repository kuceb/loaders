import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const NEXT_SCREEN = 'next_screen'

export const SCREEN_APP = {
  MENU: 'menu',
  INFO: 'info',
  DEMO: 'demo',
  EXPERIMENT: 'experiment',
}

const app = {
  namespaced: true,
  state: {
    screen: SCREEN_APP.MENU,
    demoComplete: false,
  },
  mutations: {
    [NEXT_SCREEN](state, screen) {
      state.screen = screen
    },
    DEMO_COMPLETE(state) {
      state.demoComplete = true
    },
  },
}

export const ADD_RESULT = 'add_result'
export const SCREEN_EXPERIMENT = {
  WAITING: 'waiting',
  LOADING: 'loading',
  GUESSING: 'guessing',
  DONE: 'done',
}
const experiment = {
  namespaced: true,
  state: {
    results: [],
    screen: SCREEN_EXPERIMENT.WAITING,
  },
  mutations: {
    [NEXT_SCREEN](state, screen) {
      state.screen = screen
    },
    [ADD_RESULT](state, result) {
      state.results = state.results.concat([result])
    },
    CLEAR_RESULTS(state) {
      state.results = []
    },
  },

}


export default new Vuex.Store({
  modules: {
    app,
    experiment,
  },


})
