<template>
  <v-layout
    text-xs-center
    justify-center
    align-center
  >
    <v-slide-y-transition mode="out-in">
      <div
        v-if="screen===SCREEN.WAITING"
        key="waiting"
      >
        <template>
          <v-progress-linear v-model="experimentProgress" />
        </template>
        click to continue to the next loader.<br>
        <v-btn @click="startLoading()">Load</v-btn>
      </div>

      <DemoLoader
        v-else-if="screen===SCREEN.LOADING && id === 'demo'"
        class="no-anim"
        :indicator="currentResult.indicator"
        :current-percentage="currentPercentage"
      />
      <Loader
        v-else-if="screen===SCREEN.LOADING"
        class="no-anim"
        :indicator="currentResult.indicator"
        :current-percentage="currentPercentage"
      />
      <div
        v-else-if="screen === SCREEN.GUESSING"
        key="guessing"
      >
        <v-scale-transition mode="out-in">
          <div
            v-if="!pressTime"
            key="sd"
          >
            <!-- <v-fade-transition mode="out-in"> -->
            <span
              v-if="!pressing"
              key="1"
            >Hold the spacebar</span>
            <span
              v-else
              key="2"
            >Release when ready</span>
            <!-- </v-fade-transition> -->
            <div
              :class="{
                spacebar: true,
                down: pressing,
                'mt-3': true,
              }"
            />
          </div>
          <div
            v-else
            key="button"
          >
            <v-btn
              dark
              @click="pressTime=0;pressing=0"
            ><v-icon left>undo</v-icon>redo</v-btn>
            <v-btn
              @click="startWaiting()"
            >Submit</v-btn>
          </div>
      </v-scale-transition></div>
      <div v-else-if="screen === SCREEN.DONE">
        Done!<br> You may close this window.
      </div>


    </v-slide-y-transition>
</v-layout></template>

<script>
import * as _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import { ADD_RESULT, SCREEN_EXPERIMENT as SCREEN, NEXT_SCREEN } from '../store'

import Loader from './Loader'
import DemoLoader from './DemoLoader'


const MIN_TIME = 4000
const MAX_TIME = 8000
const PERCENTAGE_UPDATE_RATE = 5

function increment(currentVal, totalTime) {
  return Math.min(currentVal + (PERCENTAGE_UPDATE_RATE * 100) / (totalTime || 1), 99)
}

const complexityTypes = ['none', 'simple', 'moderate', 'complex']
const experimentIndicators = _.shuffle(
  _.flatten(
    _.map(complexityTypes, v => [
      { complexity: v, determinant: true },
      { complexity: v, determinant: false },
    ]),
  ),
)

const demoIndicators = [
  { complexity: 'demo1', determinant: true },
  { complexity: 'demo2', determinant: false },
]

export default {
  components: {
    Loader,
    DemoLoader,
  },
  props: {
    id: {
      type: String,
      default: 'anon',
    },
  },
  data: () => ({
    startPress: 0,
    SCREEN,
    currentResult: {
      indicator: {
        complexity: 'moderate',
        determinant: true,
      },
    },
    indicators: experimentIndicators,
    currentPercentage: 0,
    pressTime: 0,
    pressing: false,
    index: 0,
  }),
  computed: {
    experimentProgress() {
      return (this.results.length) / this.indicators.length * 100
    },
    ...mapState('experiment', {
      results: state => state.results,
      screen: state => state.screen,
      demo: state => state.demo,
    }),

  },

  mounted() {
    window.addEventListener('keydown', this.processKeyDown)
    window.addEventListener('keyup', this.processKeyUp)
    if (this.id === 'demo') {
      this.indicators = demoIndicators
    }
  },

  methods: {

    startLoading() {
      this[NEXT_SCREEN](SCREEN.LOADING)

      this.currentResult = {
        real: Math.round(MIN_TIME + Math.random() * (MAX_TIME - MIN_TIME)),
        indicator: this.indicators[this.index++],
        guess: null,
      }
      this.currentPercentage = 0
      const timer = setInterval(() => this.currentPercentage = increment(this.currentPercentage, this.currentResult.real), PERCENTAGE_UPDATE_RATE)

      setTimeout(() => {
        clearInterval(timer)
        this.startguessing()
      }, this.currentResult.real)
    },

    startguessing() {
      this.pressing = false
      this.pressTime = 0
      this[NEXT_SCREEN](SCREEN.GUESSING)
    },

    startWaiting() {
      this.currentResult.guess = this.pressTime
      this[ADD_RESULT](_.cloneDeep(this.currentResult))
      this[NEXT_SCREEN](SCREEN.WAITING)
      if (this.index === this.indicators.length) {
        if (this.id === 'demo') {
          this.endDemo()
        } else {
          this.endExperiment()
        }

      }
    },

    async endDemo() {
      this.$store.commit('experiment/CLEAR_RESULTS')
      this.$store.commit(`app/${NEXT_SCREEN}`, 'info')
      this.$store.commit('app/DEMO_COMPLETE')
    },

    async endExperiment() {
      this[NEXT_SCREEN](SCREEN.DONE)
      await fetch('https://psycode-375bf.firebaseio.com/data.json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: this.id, info: this.results,
        }),
      })
    },
    processKeyDown(e) {
      if (e.keyCode === 32) {
        if (!this.startPress) {
          this.pressing = true
          this.startPress = (new Date()).getTime()
        }
      }
    },

    processKeyUp(e) {
      if (e.keyCode === 32) {
        this.pressing = false
        const delta = (new Date()).getTime() - this.startPress
        this.pressTime = delta
        this.startPress = 0
      }
    },
    ...mapMutations('experiment', [
      ADD_RESULT,
      NEXT_SCREEN,
    ]),
  },
}
</script>

<style>
.spacebar {
  content: 'space';
  margin: 0 auto;
  border: 1px solid rgb(211, 211, 211);
  width: 100px;
  height: 20px;
  border-radius: 2px;
  box-shadow: 0 4px 4px rgb(87, 87, 87);
  transition: all 0.1s;
}
.spacebar.down {
  box-shadow: 0 1px 1px rgb(68, 68, 68);
}
</style>
