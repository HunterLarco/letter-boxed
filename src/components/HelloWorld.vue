<template>
  <div class="Host">
    <div class="Box"></div>
  </div>
</template>

<script>
import dictionary from "../assets/dictionary.json";

function prune(trie, letters) {
  const root = {
    children: [],
    isEnd: trie.isEnd,
  };

  for (const [letter, child] of Object.entries(trie.children)) {
    if (letters.has(letter)) {
      root.children[letter] = prune(child, letters);
    }
  }

  return root;
}

function solver(top, right, bottom, left) {
  console.assert(top.size == right.size);
  console.assert(top.size == bottom.size);
  console.assert(top.size == left.size);

  const domain = prune(
    dictionary,
    new Set([...top, ...right, ...bottom, ...left])
  );
}

console.log(
  solver(new Set("uvt"), new Set("ilf"), new Set("dbc"), new Set("noa"))
);

export default {
  name: "HelloWorld",
};
</script>

<style scoped lang="scss">
@import "../styles/layout.scss";

.Host {
  @include layout-center;
  @include layout-fill;
}

.Box {
  background: #fff;
  height: 300px;
  width: 300px;
}
</style>
