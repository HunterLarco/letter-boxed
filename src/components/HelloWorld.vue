<template>
  <div class="Host">
    <div class="Box" @click="solve_"></div>
  </div>
</template>

<script>
import { letterBoxed } from "../solver/solver.js";

export default {
  name: "HelloWorld",

  methods: {
    solve_() {
      console.log("Starting solver");
      const solution = letterBoxed({
        edges: ["tai", "nec", "mfr", "hlu"],
      });
      console.log("Solution", solution);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/layout.scss";

.Host {
  @include layout-center;
  @include layout-fill;
}

.Box {
  background: #fff;
  border: 3px solid #000;

  width: 300px;
  height: 300px;
}
</style>
