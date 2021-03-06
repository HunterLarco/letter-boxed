<template>
  <div :class="$style.Host">
    <div :class="$style.Box">
      <canvas :class="$style.Canvas" ref="canvas" />

      <div :class="this.draw ? $style.Dot_Filled : null">
        <div :class="$style.TopDot" style="left: 18%" />
        <div :class="$style.TopDot" style="left: 50%" />
        <div :class="$style.TopDot" style="left: 82%" />
        <div :class="$style.RightDot" style="top: 18%" />
        <div :class="$style.RightDot" style="top: 50%" />
        <div :class="$style.RightDot" style="top: 82%" />
        <div :class="$style.BottomDot" style="left: 18%" />
        <div :class="$style.BottomDot" style="left: 50%" />
        <div :class="$style.BottomDot" style="left: 82%" />
        <div :class="$style.LeftDot" style="top: 18%" />
        <div :class="$style.LeftDot" style="top: 50%" />
        <div :class="$style.LeftDot" style="top: 82%" />
      </div>

      <div :class="$style.TopLetter" style="left: 18%">
        {{ displayLetters_[0] }}
      </div>
      <div :class="$style.TopLetter" style="left: 50%">
        {{ displayLetters_[1] }}
      </div>
      <div :class="$style.TopLetter" style="left: 82%">
        {{ displayLetters_[2] }}
      </div>
      <div :class="$style.RightLetter" style="top: 18%">
        {{ displayLetters_[3] }}
      </div>
      <div :class="$style.RightLetter" style="top: 50%">
        {{ displayLetters_[4] }}
      </div>
      <div :class="$style.RightLetter" style="top: 82%">
        {{ displayLetters_[5] }}
      </div>
      <div :class="$style.BottomLetter" style="left: 82%">
        {{ displayLetters_[6] }}
      </div>
      <div :class="$style.BottomLetter" style="left: 50%">
        {{ displayLetters_[7] }}
      </div>
      <div :class="$style.BottomLetter" style="left: 18%">
        {{ displayLetters_[8] }}
      </div>
      <div :class="$style.LeftLetter" style="top: 82%">
        {{ displayLetters_[9] }}
      </div>
      <div :class="$style.LeftLetter" style="top: 50%">
        {{ displayLetters_[10] }}
      </div>
      <div :class="$style.LeftLetter" style="top: 18%">
        {{ displayLetters_[11] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LetterBoxed",

  props: {
    letters: {
      type: String,
      default: "",
    },

    draw: {
      type: Array,
      default: null,
    },
  },

  computed: {
    displayLetters_() {
      if (!this.letters) {
        return "".padEnd(12, " ");
      }

      return this.letters.trim().toUpperCase().padEnd(12, " ");
    },
  },

  methods: {
    position_(letter) {
      const positions = [
        { x: 0.18, y: 0 },
        { x: 0.5, y: 0 },
        { x: 0.82, y: 0 },
        { x: 1, y: 0.18 },
        { x: 1, y: 0.5 },
        { x: 1, y: 0.82 },
        { x: 0.82, y: 1 },
        { x: 0.5, y: 1 },
        { x: 0.18, y: 1 },
        { x: 0, y: 0.82 },
        { x: 0, y: 0.5 },
        { x: 0, y: 0.18 },
      ];
      const index = this.letters.indexOf(letter);
      if (index > positions.length) {
        throw "Invalid letter position";
      }
      return positions[index];
    },
  },

  watch: {
    draw() {
      const canvas = this.$refs.canvas;

      const width = canvas.offsetWidth * window.devicePixelRatio;
      const height = canvas.offsetHeight * window.devicePixelRatio;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      if (!this.draw) {
        return;
      }

      ctx.lineWidth = 4 * window.devicePixelRatio;
      ctx.strokeStyle = "#FDECE9";

      ctx.beginPath();
      let firstLetter = true;
      for (const word of this.draw) {
        for (const letter of word) {
          const { x, y } = this.position_(letter);
          if (firstLetter) {
            firstLetter = false;
            ctx.moveTo(x * width, y * height);
          } else {
            ctx.lineTo(x * width, y * height);
          }
        }
      }
      ctx.stroke();
    },
  },
};
</script>

<style module lang="scss">
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.Host {
  @include fonts-nytimes;

  padding: 60px;
  user-select: none;
}

.Box {
  background: #fff;
  border: 3px solid #000;
  display: inline-block;
  height: 220px;
  position: relative;
  width: 220px;
}

.Canvas {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

._Dot {
  background: #fff;
  border-radius: 50%;
  border: 3px solid #000;
  height: 12px;
  position: absolute;
  width: 12px;
}

.TopDot {
  @extend ._Dot;

  top: -1.5px;
  transform: translate(-50%, -50%);
}

.RightDot {
  @extend ._Dot;

  right: -1.5px;
  transform: translate(50%, -50%);
}

.BottomDot {
  @extend ._Dot;

  bottom: -1.5px;
  transform: translate(-50%, 50%);
}

.LeftDot {
  @extend ._Dot;

  left: -1.5px;
  transform: translate(-50%, -50%);
}

.Dot_Filled {
  .TopDot,
  .RightDot,
  .BottomDot,
  .LeftDot {
    background: #f8aa9e;
  }
}

._Letter {
  color: #fff;
  font-size: 26px;
  font-weight: 600;
  padding: 12px 16px;
  position: absolute;
}

.TopLetter {
  @extend ._Letter;

  top: 0;
  transform: translate(-50%, -100%);
}

.RightLetter {
  @extend ._Letter;

  right: 0;
  transform: translate(100%, -50%);
}

.BottomLetter {
  @extend ._Letter;

  bottom: 0;
  transform: translate(-50%, 100%);
}

.LeftLetter {
  @extend ._Letter;

  left: 0;
  transform: translate(-100%, -50%);
}
</style>
