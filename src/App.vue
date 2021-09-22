<template>
  <HelloWorld />
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style lang="scss">
@import "./styles/layout.scss";

#app {
  @include layout-fill;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background: #F8AA9E;
}

* {
  color: inherit;
  font: inherit;
  margin: 0;
  padding: 0;
}
</style>
