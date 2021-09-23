<template>
  <Solver/>
</template>

<script>
import Solver from "@/components/Solver.vue";

export default {
  name: "App",
  components: { Solver },
};
</script>

<style lang="scss">
@import "./styles/layout.scss";

#app {
  @include layout-fill;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background: #f8aa9e;
}

* {
  color: inherit;
  font: inherit;
  margin: 0;
  padding: 0;
}
</style>
