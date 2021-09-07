<template>
  <div class="Host">
    <div class="Box" @click="solve_"></div>
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

function solver({ edges }) {
  const totalLetters = new Set(edges.join("").split(""));
  const domain = prune(dictionary, totalLetters);

  let iteration = {
    current: [],
    next: [],
  };

  // Bootstrap the broadphase iteration.
  for (let i = 0; i < edges.length; ++i) {
    for (const character of edges[i]) {
      iteration.current.push({
        path: [character],
        letters: new Set(character),
        edge: i,
        node: domain.children[character],
      });
    }
  }

  while (iteration.current.length > 0) {
    const solutions = [];
    for (const step of iteration.current) {
      if (step.letters.size == totalLetters.size && step.node.isEnd) {
        solutions.push(step.path);
      }
      if (solutions.length > 0) {
        continue;
      }

      for (let i = 0; i < edges.length; ++i) {
        if (i == step.edge) {
          continue;
        }

        for (const character of edges[i]) {
          const usedLetters = new Set([...step.letters, character]);

          const node = step.node.children[character];
          if (node) {
            const nextPath = [...step.path];
            nextPath[nextPath.length - 1] += character;
            const nextStep = {
              path: nextPath,
              letters: new Set([...step.letters, character]),
              edge: i,
              node,
            };

            iteration.next.push(nextStep);
          }
        }
      }

      if (step.node.isEnd) {
        const lastWord = step.path[step.path.length - 1];
        const lastLetter = lastWord[lastWord.length - 1];

        const node = domain.children[lastLetter];
        if (node) {
          const nextStep = {
            path: [...step.path, lastLetter],
            letters: new Set([...step.letters]),
            edge: step.edge,
            node: node,
          };

          iteration.next.push(nextStep);
        }
      }
    }

    if (solutions.length > 0) {
      return solutions;
    }

    iteration.current = iteration.next;
    iteration.next = [];
  }
}

export default {
  name: "HelloWorld",

  methods: {
    solve_() {
      console.log("Starting solver");
      const solution = solver({
        // edges: ["tai", "nec", "mfr", "hlu"],
        edges: ["uyt", "ilf", "dbc", "noa"],
      });
      console.log("Solution", solution);
    },
  },
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
