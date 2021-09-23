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
          @mouseover.native="hoverEnter_(solution)"
          @mouseleave.native="hoverExit_(solution)"
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

  methods: {
    hoverEnter_(solution) {
      this.$emit('hoverenter', { solution });
    },

    hoverExit_(solution) {
      this.$emit('hoverexit', { solution });
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
