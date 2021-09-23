<template>
  <div :class="$style.Host">
    <LetterBoxed :letters="'asdf'" />

    <!--
    <div class="Form">
      <input
        class="Input"
        maxlength="3"
        placeholder="Top"
        ref="top"
        v-model="edges.top"
        @keydown="enforcePattern_($event, /^[a-zA-Z]*$/)"
        @keyup="moveFocus_($event, 'right')"
      />

      <input
        class="Input"
        maxlength="3"
        placeholder="Right"
        ref="right"
        v-model="edges.right"
        @keypress="enforcePattern_($event, /^[a-zA-Z]*$/)"
        @keyup="moveFocus_($event, 'bottom')"
      />

      <input
        class="Input"
        maxlength="3"
        placeholder="Bottom"
        ref="bottom"
        v-model="edges.bottom"
        @keypress="enforcePattern_($event, /^[a-zA-Z]*$/)"
        @keyup="moveFocus_($event, 'left')"
      />

      <input
        class="Input"
        maxlength="3"
        placeholder="Left"
        ref="left"
        v-model="edges.left"
        @keypress="enforcePattern_($event, /^[a-zA-Z]*$/)"
        @keyup="moveFocus_($event, 'submit')"
      />

      <div
        :class="submitEnabled_ ? 'Button' : 'Button_Disabled'"
        ref="submit"
        tabindex="0"
        @click="submit_"
        @keypress.enter="submit_"
      >
        Solve
      </div>

      <div class="Solutions">
        <template v-if="solutions.twoWords.length">
          <div><br /><b>Two Words:</b></div>

          <div class="Solution" v-for="solution of solutions.twoWords">
            <div class="Word" v-for="word of solution">
              {{ word }}
            </div>
            ({{ solution.join("").length }})
          </div>
        </template>

        <template
          v-if="solutions.twoWords.length == 0 && solutions.minLetters.length"
        >
          <div><br /><b>Two Words:</b></div>
          <div class="Solution">There are no two word solutions.</div>
        </template>

        <template v-if="solutions.minLetters.length">
          <div><br /><b>Min Letters:</b></div>

          <div class="Solution" v-for="solution of solutions.minLetters">
            <div class="Word" v-for="word of solution">
              {{ word }}
            </div>
            ({{ solution.join("").length }})
          </div>
        </template>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import LetterBoxed from "@/components/LetterBoxed";
import { letterBoxed, LetterBoxedMode } from "../solver/solver.js";

export default {
  name: "HelloWorld",
  components: { LetterBoxed },

  data() {
    return {
      solutions: {
        minLetters: [],
        twoWords: [],
      },

      edges: {
        top: "",
        right: "",
        bottom: "",
        left: "",
      },
    };
  },

  methods: {
    enforcePattern_(event, pattern) {
      if (event.key.length > 1) {
        // Probably a modifier key so we should allow it.
        return true;
      }

      if (!pattern.test(event.key)) {
        event.preventDefault();
        return false;
      }

      return true;
    },

    moveFocus_(event, ref) {
      if (event.key.length > 1) {
        // Don't move focus when modifier keys are pressed. Only during
        // character entry.
        return;
      }

      if (this.submitEnabled_) {
        this.$refs.submit.focus();
        return;
      }

      const maxLength = parseInt(event.target.getAttribute("maxlength"));
      if (event.target.value.length >= maxLength) {
        this.$refs[ref].focus();
      }
    },

    submit_() {
      this.solutions.twoWords = letterBoxed({
        edges: [
          this.edges.top,
          this.edges.right,
          this.edges.bottom,
          this.edges.left,
        ],
        mode: LetterBoxedMode.TwoWords,
      });

      this.solutions.minLetters = letterBoxed({
        edges: [
          this.edges.top,
          this.edges.right,
          this.edges.bottom,
          this.edges.left,
        ],
        mode: LetterBoxedMode.MinLetters,
      });
    },
  },

  computed: {
    submitEnabled_() {
      const topMaxLength = this.$refs.top
        ? this.$refs.top.getAttribute("maxlength")
        : undefined;
      const rightMaxLength = this.$refs.right
        ? this.$refs.right.getAttribute("maxlength")
        : undefined;
      const bottomMaxLength = this.$refs.bottom
        ? this.$refs.bottom.getAttribute("maxlength")
        : undefined;
      const leftMaxLength = this.$refs.left
        ? this.$refs.left.getAttribute("maxlength")
        : undefined;

      return (
        this.edges.top.length == topMaxLength &&
        this.edges.right.length == rightMaxLength &&
        this.edges.bottom.length == bottomMaxLength &&
        this.edges.left.length == leftMaxLength
      );
    },
  },
};
</script>

<style module lang="scss">
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.Host {
  @include layout-center;
  @include layout-fill;
}

.Form {
  @include fonts-nytimes;
}

.Input {
  background: rgba(#fff, 0.25);
  border-radius: 0;
  border: none;
  font-size: 20px;
  outline: none;
  padding: 10px;
  text-transform: uppercase;
  width: 100px;

  &:focus {
    background: rgba(#fff, 0.5);
  }
}

.Button {
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
  padding: 10px;
  background: blue;

  &:focus {
    background: yellow;
    outline: none;
  }
}

.Button_Disabled {
  @extend .Button;

  background: gray;
  cursor: not-allowed;
}

.Solutions {
}

.Solution {
}

.Word {
  display: inline-block;

  & + .Word::before {
    content: "\2192";
    padding: 0 4px;
  }
}
</style>
