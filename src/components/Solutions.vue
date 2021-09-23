<template>
  <div :class="$style.Host">
    <div :class="$style.Title">{{ title }}</div>

    <template v-if="loading">
      <div :class="$style.Text">Solving...</div>
    </template>
    <template v-else>
      <template v-if="solutions.length">
        <Solution
          :words="solution"
          :key="solution.join('')"
          v-for="solution of solutions"
        />
      </template>
      <template v-else>
        <div :class="$style.Text">No solutions found</div>
      </template>
    </template>
  </div>
</template>

<script>
import Solution from "@/components/Solution";

export default {
  name: "Solutions",
  components: { Solution },

  props: {
    title: {
      type: String,
      required: true,
    },

    solutions: {
      type: Array,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style module lang="scss">
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.Host {
}

.Title {
  @include fonts-nytimes;

  font-weight: 600;
  margin-bottom: 5px;
}

.Text {
  @include fonts-nytimes;

  font-weight: 400;
  opacity: 0.5;
}
</style>
