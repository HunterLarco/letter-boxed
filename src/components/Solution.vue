<template>
  <div :class="$style.Host">
    <VuePopper
      :class="$style.Word"
      :key="word"
      v-for="word of words"
      hover
      @open:popper="define_(word)"
    >
      <div :class="$style.WordText">{{ word }}</div>
      <template #content>
        <Definition :class="$style.Definition" :word="word" />
      </template>
    </VuePopper>

    <div :class="$style.Length">({{ words.join("").length }})</div>
  </div>
</template>

<script>
import VuePopper from "vue3-popper";

import Definition from "@/components/Definition";

import Store from "@/store";

export default {
  name: "Solution",
  components: { Definition, VuePopper },

  props: {
    words: {
      type: Array,
      required: true,
    },
  },

  methods: {
    define_(word) {
      Store.define(word);
    },
  },
};
</script>

<style module lang="scss">
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.Host {
  @include fonts-nytimes;
  @include layout-horizontal;

  font-weight: 400;
  white-space: nowrap;
}

.Word {
  display: inline-block;

  & + .Word::before {
    content: "\2192";
    padding: 0 4px;
  }
}

.WordText {
  cursor: pointer;
}

.Length {
  opacity: 0.5;
  padding-left: 10px;
}

.Definition {
  background: #fff;
  border-radius: 4px;
  border: 3px solid #000;
  max-width: 350px;
  position: relative;
  white-space: normal;
}
</style>
