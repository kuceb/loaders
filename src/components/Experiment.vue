<template>
  <v-layout
    text-xs-center
    justify-center
    align-center
  >
    <v-slide-y-transition mode="out-in">
      <div
        v-if="waiting"
        key="waiting"
      >
        click to continue to the next loader.<br>
        <v-btn @click="startLoading()">Continue</v-btn>
      </div>
      <div
        v-else-if="loading"
        class="no-anim"
      >
        <div v-if="currentResult.indicator.complexity==='none'">
          loading...
        </div>
        <div v-else-if="currentResult.indicator.complexity==='simple'">
          <div class="ball">
            <div />
          </div>
        </div>
        <div v-else-if="currentResult.indicator.complexity==='moderate'">
          <div class="ball">
            <div />
            <div />
            <div />
          </div>
        </div>
        <div v-else-if="currentResult.indicator.complexity==='complex'">
          <img src="../assets/pig.gif">
        </div>

        <v-flex
          v-if="currentResult.indicator.determinant"
          class="headline"
          mt-4
        >
          {{ Math.round(currentPercentage) }}%
        </v-flex>

      </div>
      <div
        v-else-if="afterLoading"
        key="afterLoading"
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
        </v-scale-transition>
      </div>
      <div v-else-if="done">
        Done!<br> You may close this window.
      </div>


    </v-slide-y-transition>
</v-layout></template>

<script>
import * as _ from 'lodash'

const complexityTypes = ['none', 'simple', 'moderate', 'complex']
const MIN_TIME = 2000
const MAX_TIME = 4000

const indicators = _.shuffle(_.flatten(
  _.map(complexityTypes, v => [
    { complexity: v, determinant: false },
    { complexity: v, determinant: true },
  ]),
))

let start = 0


export default {
  props: {
    id: {
      type: String,
      default: 'anon',
    },
  },
  data: () => ({
    waiting: true,
    loading: false,
    afterLoading: false,
    done: false,
    results: [],
    currentResult: {
      indicator: {
        complexity: 'moderate',
        determinant: true,
      },
      // null
    },
    currentPercentage: 0,
    pressTime: 0,
    pressing: false,
  }),

  mounted() {
    window.addEventListener('keydown', this.processKeyDown)
    window.addEventListener('keyup', this.processKeyUp)
  },

  methods: {
    countUp() {
      this.currentPercentage = Math.min(this.currentPercentage + 5000 / (this.currentResult.real || 1), 99)
    },
    startLoading() {
      this.waiting = false
      this.loading = true

      this.currentResult = {
        real: Math.round(MIN_TIME + Math.random() * (MAX_TIME - MIN_TIME)),
        indicator: indicators.shift(),
        guess: null,
      }
      this.currentPercentage = 0
      const timer = setInterval(this.countUp, 50)// Call increaseMyVar every 30ms


      setTimeout(() => {
        clearInterval(timer)
        this.startAfterLoading()
      }, this.currentResult.real)
    },

    startAfterLoading() {
      this.pressing = false
      this.pressTime = 0
      this.loading = false
      this.afterLoading = true
    },

    startWaiting() {
      this.currentResult.guess = this.pressTime
      this.results.push(_.cloneDeep(this.currentResult))
      this.afterLoading = false
      this.waiting = true

      if (!indicators.length) {
        this.endExperiment()
      }
    },

    async endExperiment() {
      this.waiting = false
      this.done = true
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
    processKeyDown() {
      if (!start) {
        this.pressing = true
        start = (new Date()).getTime()
      }
    },

    processKeyUp() {
      this.pressing = false
      const delta = (new Date()).getTime() - start
      this.pressTime = delta
      start = 0
    },

  },
}
</script>

<style>
.ball div {
  display: inline-block;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  margin: 10px;
  animation: bounce 1.2s infinite 0.2s;
}
.ball div:nth-child(1) {
  background-color: salmon;
  animation: bounce 1.2s infinite 0s;
}
.ball div:nth-child(2) {
  background-color: rgb(114, 250, 198);
  animation: bounce 1.2s infinite 0.1s;
}
.ball div:nth-child(3) {
  background-color: rgb(150, 114, 250);
  animation: bounce 1.2s infinite 0.3s;
}

@keyframes bounce {
  50% {
    transform: translateY(-80px);
  }
}

.no-anim {
  transition: 0s
}
</style>
