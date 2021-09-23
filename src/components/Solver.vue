<template>
  <div :class="$style.Host">
    <div :class="$style.Frame">
      <div>
        <div :class="$style.InputBar">
          <input
            :class="$style.LettersInput"
            v-model="letters_"
            maxlength="12"
            placeholder="abc..."
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

      <div :class="$style.Solutions" v-if="solutions.letters">
        <Solutions
          :class="$style.Solution"
          title="Smallest Two Word Solutions"
          :solutions="solutions.twoWords"
        />
        <Solutions
          :class="$style.Solution"
          title="Smallest Overall Solutions"
          :solutions="solutions.minLetters"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LetterBoxed from "@/components/LetterBoxed";
import Solutions from "@/components/Solutions";
import { letterBoxed, LetterBoxedMode } from "../solver/solver.js";

export default {
  name: "HelloWorld",
  components: { LetterBoxed, Solutions },

  data() {
    return {
      letters_: "",

      solutions: {
        letters: null,
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
      this.solutions.letters = null;
      this.solutions.twoWords = [];
      this.solutions.minLetters = [];
    },

    submit_() {
      if (!this.submitEnabled_) {
        return;
      }

      const edges = [
        this.letters_.toLowerCase().slice(0, 3),
        this.letters_.toLowerCase().slice(3, 6),
        this.letters_.toLowerCase().slice(6, 9),
        this.letters_.toLowerCase().slice(9, 12),
      ];

      this.solutions.letters = this.letters_;

      this.$nextTick(() => {
        this.solutions.twoWords = letterBoxed({
          edges,
          mode: LetterBoxedMode.TwoWords,
        });

        this.solutions.minLetters = letterBoxed({
          edges,
          mode: LetterBoxedMode.MinLetters,
        });
      });
    },
  },

  computed: {
    clearEnabled_() {
      return this.letters_.length > 0;
    },

    submitEnabled_() {
      return (
        this.letters_.length == 12 && this.solutions.letters != this.letters_
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

.Frame {
  @include layout-horizontal;

  grid-gap: 30px;
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

  &::placeholder {
    color: rgba(51, 51, 51, 0.35);
  }
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
  padding-top: 130px;
}

.Solution {
  & + .Solution {
    padding-top: 30px;
  }
}
</style>
