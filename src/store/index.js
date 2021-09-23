import { reactive, readonly } from "vue";

import * as dictionary from '@/solver/dictionary';

function createStore({ state, actions, mutations }) {
  const reactiveState = reactive(state);
  const store = { state: readonly(reactiveState) };

  for (const [key, method] of Object.entries(actions)) {
    store[key] = async (...args) => {
      console.log(`Action "${key}"`, ...args);
      return await method.call(this, reactiveState, ...args);
    };
  }

  return store;
}

export default createStore({
  state: {
    dictionary: {
      definitions: {},
    },
  },

  actions: {
    async define(state, word) {
      if (state.dictionary.definitions[word]) {
        return state.dictionary.definitions[word];
      }

      const definitions = await dictionary.define(word);
      state.dictionary.definitions[word] = definitions;
      return definitions;
    },
  },
});
