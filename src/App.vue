<template>
  <v-app>
    <v-toolbar
      app
      height="40px"
      flat
    >
      <v-toolbar-title class="headline">
        <span>Psycode</span>
        <span class="font-weight-light"> Experiment</span>
      </v-toolbar-title>
      <v-spacer />
      id:&nbsp;<span class="font-weight-bold"> {{ id }}</span>
    </v-toolbar>

    <v-content>
      <v-container
        fill-height=""
        align-center
      >
        <v-layout>
          <v-slide-y-transition mode="out-in">
            <v-flex
              v-if="menu"
              key="menu"
              text-xs-center
              column=""
            >
              <v-flex
                title
                font-weight-light
              >
                <p>Welcome to the Psycode experiment. Before we being, here's a survey.</p><p>
                  Your results will be anonymized.</p>
              </v-flex>
              <v-btn
                target="blank"
                :href="`https://docs.google.com/forms/d/e/1FAIpQLSc9PCjwowMc5Anpc_f2_LVIdC7ctjpAogN0qOveaqP4_gtV_w/viewform?entry.795072666=${id}`"
                @click="menu = false; info = true"
              >Survey</v-btn>
            </v-flex>
            <v-flex
              v-else-if="info"
              text-xs-center
            >
              <v-flex>
                <v-btn
                  @click="start()"
                >Start</v-btn>
              </v-flex>
            </v-flex>
            <Experiment
              v-else
              :id="id"
              key="app"
            />
          </v-slide-y-transition>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Experiment from './components/Experiment.vue'

export default {
  name: 'App',
  components: {
    Experiment,
  },
  data: () => ({
    menu: true,
    info: false,
    id: Math.round(Math.random() * 10000000).toString(16),
  }),
  methods: {
    start() {
      this.info = false
    },
  },
}
</script>
