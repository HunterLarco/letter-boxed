<template>
  <div :class="$style.Host">
    <div :class="$style.Word" :key="word" v-for="word of words">
      {{ word }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Solution",

  props: {
    words: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style module lang="scss">
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.Host {
  @include fonts-nytimes;

  font-weight: 400;
}

.Word {
  display: inline-block;

  & + .Word::before {
    content: "\2192";
    padding: 0 4px;
  }
}
</style>
