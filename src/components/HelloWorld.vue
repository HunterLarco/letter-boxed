<template>
  <div :class="$style.Host">
    <div>
      <div :class="$style.InputBar">
        <input
          :class="$style.LettersInput"
          v-model="letters_"
          maxlength="12"
          @keydown="enforcePattern_($event, /^[a-zA-Z]*$/)"
          @keypress.enter="submit_"
        />
      </div>
      <div>
        <LetterBoxed :letters="letters_" />
      </div>
      <div :class="$style.ButtonBar">
        <div
          :class="clearEnabled_ ? $style.Button : $style.Button_Disabled"
          tabindex="0"
          @click="clear_"
          @keypress.enter="clear_"
        >
          Clear
        </div>
        <div
          :class="submitEnabled_ ? $style.Button : $style.Button_Disabled"
          tabindex="0"
          @keypress.enter="submit_"
          @click="submit_"
        >
          Solve
        </div>
      </div>
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
</template>

<script>
import LetterBoxed from "@/components/LetterBoxed";
import { letterBoxed, LetterBoxedMode } from "../solver/solver.js";

export default {
  name: "HelloWorld",
  components: { LetterBoxed },

  data() {
    return {
      letters_: "",

      solutions: {
        state: null,
        minLetters: [],
        twoWords: [],
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

    clear_() {
      this.letters_ = "";
      this.solutions.state = null;
      this.solutions.twoWords = [];
      this.solutions.minLetters = [];
    },

    submit_() {
      if (!this.submitEnabled_) {
        return;
      }

      const edges = [
        this.letters_.slice(0, 3),
        this.letters_.slice(3, 6),
        this.letters_.slice(6, 9),
        this.letters_.slice(9, 12),
      ];

      this.solutions.state = "solving";

      this.$nextTick(() => {
        this.solutions.twoWords = letterBoxed({
          edges,
          mode: LetterBoxedMode.TwoWords,
        });

        this.solutions.minLetters = letterBoxed({
          edges,
          mode: LetterBoxedMode.MinLetters,
        });

        this.solutions.state = "solved";
      });
    },
  },

  computed: {
    clearEnabled_() {
      return this.letters_.length > 0;
    },

    submitEnabled_() {
      return this.letters_.length == 12 && this.solutions.state == null;
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

.InputBar {
  padding-bottom: 30px;
}

.LettersInput {
  @include fonts-nytimes;

  background: none;
  border: none;
  border-bottom: 3px solid #000;
  display: block;
  font-size: 26px;
  font-weight: 600;
  margin: 0 auto;
  outline: none;
  padding: 6px 0;
  text-align: center;
  text-transform: uppercase;
  width: 240px;
}

.ButtonBar {
  padding-top: 10px;
  text-align: center;
}

.Button {
  @include fonts-nytimes;

  border-radius: 40px;
  border: 1px solid rgba(51, 51, 51, 0.5);
  color: #333;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  padding: 12px 20px;
  user-select: none;

  &:focus {
    outline: none;
    border: 1px solid #000;
  }

  &:hover {
    background-color: #eaa195;
  }

  & + .Button {
    margin-left: 20px;
  }
}

.Button_Disabled {
  @extend .Button;

  cursor: not-allowed;
  opacity: 0.5;

  &:focus {
    border: 1px solid rgba(51, 51, 51, 0.5);
  }
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
