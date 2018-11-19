
<template>
  <div>
    <div v-if="indicator.complexity==='demo1'">
      <div class="ball">
        <div />
        <div />
        <div />
      </div>
    </div>
    <div v-else-if="indicator.complexity==='demo2'">
      <div class="ball">
        <div />
      </div>
    </div>
    <v-flex
      v-if="indicator.determinant"
      class="headline"
      mt-4
    >
      {{ Math.round(currentPercentage) }}<span class="subheading">%</span>
    </v-flex>
  </div>
</template>

<script>
export default {
  props: {
    indicator: Object,
    currentPercentage: Number,
  },
}
</script>
<style scoped>

.ball {
	position: relative;
	top: -40px;
	left: -12px;
}
.ball div {
	position: absolute;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  margin: 10px;
  animation: bounce 1.5s infinite;
}
.ball div:nth-child(1) {
  background-color: salmon;
  animation-delay: 0s;
}
.ball div:nth-child(2) {
  background-color: rgb(114, 250, 198);
  animation-delay: 1s;
}
.ball div:nth-child(3) {
  background-color: rgb(150, 114, 250);
  animation-delay: 0.5s;
}

@keyframes bounce {
  50% {
    transform: scale(2);
  }
}

.no-anim {
  transition: 0s;
}
</style>
