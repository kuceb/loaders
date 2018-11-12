<template>
  <v-app>
    <v-toolbar app height="40px" flat>
      <v-toolbar-title class="headline" >
        <span>Psycode</span>
        <span class="font-weight-light"> Experiment</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <v-container align-center justify-center="" fill-height>
      <v-slide-x-transition mode="out-in">
      <div v-if="menu" key="menu">
      Welcome to the Psycode experiment. When you're ready, press continue
      <v-btn  @click="menu = false; info = true">Continue</v-btn>
      </div>
      <div v-else-if="info">
      <v-text-field v-model="name" required label="name"/>
      <v-btn  @click="if (name) info = false">Start</v-btn>
      </div >
      <Experiment :name="name" v-else key="app"/>
      </v-slide-x-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Experiment from './components/Experiment'

export default {
  name: 'App',
  components: {
    Experiment
  },
  data: ()=>({
    menu: true,
    info: false,
  })
}
</script>
