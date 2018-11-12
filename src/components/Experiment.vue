<template>
  <v-tab-transition mode="out-in">
    <div v-if="waiting">
      click to continue to the next loader.<br>
      <v-btn @click="startLoading()">Continue</v-btn>
    </div>
    <div v-else-if="loading">
      <div v-if="currentResult.indicator.complexity==='none'">
        loading...
      </div> 
      <div v-else-if="currentResult.indicator.complexity==='simple'">
        <div class="ball">
          <div></div>
        </div>
      </div> 
      <div v-else-if="currentResult.indicator.complexity==='moderate'">
        <div class='ball'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div> 
      <div v-else-if="currentResult.indicator.complexity==='complex'">
        <img src="../assets/pig.gif"/>
      </div> 
      <v-subheader v-if="currentResult.indicator.determinant">
          {{currentTimeLeft/100}}%
      </v-subheader>
    </div>
    <div v-else-if="afterLoading">
      <div v-if="!this.pressTime"> Hold spacebar</div>
      <v-btn v-else @click="startWaiting()">Submit</v-btn>
    </div>
    <div v-else-if="done">
      Done! thank you, have a nice day.
    </div>


  </v-tab-transition>
</template>

<script>
  import * as _ from "lodash";
  const complexityTypes = ['none', 'simple', 'moderate', 'complex']
  const MAX_TIME = 1000

  const indicators = _.shuffle(_.flatten(
    _.map(complexityTypes, (v) => [
    {complexity:v, determinant:true},
    {complexity:v, determinant:true}
    ])
  ))
  console.log(indicators)

  let start = 0;


  export default {
    props: {
      name
    },
    data: () => ({
      results: [],
      loading: false,
      afterLoading:false,
      waiting: true,
      currentResult: {
        indicator: {
          complexity: 'simple',
          determinant: true,
        }
        //null
      },
      currentTimeLeft: null,
      pressTime: 0,
      done: false
    }),

    mounted() {
      console.log(this.name)
      setInterval(this.countUp,100)//Call increaseMyVar every 30ms
      setInterval(()=>console.log(this.pressTime), 1000)
      window.addEventListener('keydown', this.processKeyDown)

      window.addEventListener('keyup', this.processKeyUp)
    },

    methods: {
      countUp() {
          this.currentTimeLeft = Math.round(this.currentTimeLeft + this.currentTimeLeft % 99);
      },
      startLoading() {
        this.waiting = false
        this.loading = true
        
        this.currentResult = {
          real: Math.round(1000+Math.random()*MAX_TIME),
          indicator: indicators.shift(),
          guess: null
        }
        this.currentTimeLeft = this.currentResult.real

        

        setTimeout(()=>{
          this.startAfterLoading()
        }, this.currentResult.real)
      },

      startAfterLoading() {
        this.pressTime = 0
        this.loading =false
        this.afterLoading = true
      },

      startWaiting() {
        this.currentResult.guess = this.pressTime
        this.results.push(_.cloneDeep(this.currentResult))
        this.afterLoading = false
        this.waiting = true
        console.log(JSON.stringify({
            user: name, info: this.results
              }))
        console.log('indeixctor length', indicators.length)
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
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
          body: JSON.stringify({
            user: this.name, info: this.results
              })
      })
      },
    processKeyDown(e) {
      if (!start) {
          start = (new Date()).getTime();
      }
    },

    processKeyUp(e) {
    var delta = (new Date()).getTime() - start;
    this.pressTime = delta
    start = 0;
}
      
    }
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
</style>
