<template>
  <div class="Host">
    <div class="Box"></div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
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
  height: 300px;
  width: 300px;
}
</style>
