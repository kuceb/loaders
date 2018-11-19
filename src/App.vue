<template>
  <v-app>
    <v-toolbar
      app
      height="40px"
      flat
      :color="screen ==='demo' ? 'accent': ''"
    >
      <v-toolbar-title class="headline">
        <span>Psycode</span>
        <span class="font-weight-light"> Experiment</span>
      </v-toolbar-title>
      <v-spacer />
      id:&nbsp;<span class="font-weight-bold">{{ id }}</span>
    </v-toolbar>

    <v-content>
      <v-container
        fill-height=""
        align-center
      >
        <v-layout>
          <v-slide-y-transition mode="out-in">
            <v-flex
              v-if="screen === 'menu'"
              key="menu"
              text-xs-center
              column=""
            >
              <v-flex
                title
                font-weight-light
              >
                <p>Welcome to the Psycode experiment. Before we begin, here's a survey.</p><p>
                  Your results will be anonymized.</p>
              </v-flex>
              <v-btn
                target="blank"
                :href="`https://docs.google.com/forms/d/e/1FAIpQLSc9PCjwowMc5Anpc_f2_LVIdC7ctjpAogN0qOveaqP4_gtV_w/viewform?entry.795072666=${id}`"
                @click="infoScreen()"
              >Survey</v-btn>
            </v-flex>
            <v-flex
              v-else-if="screen === 'info'"
              text-xs-center
            >
              <v-flex>
                <span v-if="!demoComplete">
                  Before we start, please take this short demo.
                </span>
                <span v-else>
                  Great! Click start to begin
                </span>
                <br>
                <v-btn
                  :disabled="demoComplete" @click="$store.commit('app/next_screen', SCREEN.DEMO)"
                >Take demo</v-btn>
              </v-flex>
              <v-flex>
                <v-btn
                  :disabled="!demoComplete" @click="$store.commit('app/next_screen', SCREEN.EXPERIMENT)"
                >start</v-btn>
              </v-flex>
            </v-flex>

            <Experiment
              v-else-if="screen === 'demo'"
              :id="'demo'"
              key="demo"
            />
            <Experiment
              v-else-if="screen === 'experiment'"
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
import { mapState } from 'vuex'
import Experiment from './components/Experiment.vue'
import { SCREEN_APP as SCREEN, NEXT_SCREEN } from './store'


export default {
  name: 'App',
  components: {
    Experiment,
  },
  data: () => ({
    info: false,
    id: Math.round(Math.random() * 10000000).toString(16),
    NEXT_SCREEN,
    SCREEN,

  }),
  computed: {
    ...mapState('app', [
      'screen',
      'demoComplete',
    ]),
  },
  methods: {
    infoScreen() {
      this.$store.commit(`app/${NEXT_SCREEN}`, SCREEN.INFO)
      // / this.$store.state.app.screen
      // / this.screen
    },
  },
}
</script>
