<template>
  <div :class="$style.Host" v-if="definitions_.length">
    <div :class="$style.Word">
      <span :class="$style.Def">def.</span> {{ word }}
    </div>

    <div :class="$style.Section" :key="def.meta.id" v-for="def of definitions_">
      <template v-if="def.shortdef.length">
        <div :class="$style.Title">{{ def.fl }}</div>
        <ol :class="$style.SectionList">
          <li :key="shortdef" v-for="shortdef of def.shortdef">
            {{ shortdef }}
          </li>
        </ol>
      </template>

      <template v-else>
        <div :class="$style.Title">{{ def.cxs[0].cxl }}</div>
        <ol :class="$style.SectionList">
          <li v-for="word of def.cxs[0].cxtis">{{ word.cxt }}</li>
        </ol>
      </template>
    </div>
  </div>
</template>

<script>
import Store from "@/store";

export default {
  name: "Definition",

  props: {
    word: {
      type: String,
      required: true,
    },
  },

  computed: {
    definitions_() {
      // Generally any definitions other than the first two are too obscure to
      // be useful.
      const definitions = Store.state.dictionary.definitions[this.word];
      return definitions ? definitions.slice(0, 2) : [];
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
  padding: 20px;
}

.Word {
  font-weight: 600;
  padding-bottom: 20px;
}

.Def {
  @include fonts-script;

  display: inline-block;
  font-size: 30px;
  font-weight: 400;
  margin-right: 2px;
  opacity: 0.5;
}

.Title {
  font-weight: 600;
  padding-bottom: 4px;
}

.Section {
  & + .Section {
    margin-top: 20px;
  }
}

.SectionList {
  padding-left: 30px;
}
</style>
