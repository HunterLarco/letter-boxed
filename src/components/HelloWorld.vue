<template>
  <div class="Host">
    <div class="Box" @click="solve_"></div>
  </div>
</template>

<script>
import dictionary from "../assets/dictionary.json";

function prune(trie, letters) {
  const root = {
    children: {},
    isEnd: trie.isEnd,
  };

  for (const [letter, child] of Object.entries(trie.children)) {
    if (!letters.has(letter)) {
      continue;
    }

    const subtree = prune(child, letters);
    if (Object.keys(subtree.children).length == 0 && !subtree.isEnd) {
      continue;
    }

    root.children[letter] = subtree;
  }

  return root;
}

function solver({ edges }) {
  const totalLetters = new Set(edges.join("").split(""));
  const domain = prune(dictionary, totalLetters);

  console.log(domain);

  let iteration = {
    current: [],
    next: [],
    stash: [],
  };

  // Bootstrap the broadphase iteration.
  for (let i = 0; i < edges.length; ++i) {
    for (const character of edges[i]) {
      if (domain.children[character]) {
        iteration.current.push({
          path: [character],
          letters: new Set(character),
          edge: i,
          node: domain.children[character],
        });
      }
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
          const newLetter = usedLetters.size > step.letters.size;

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

            if (newLetter) {
              iteration.next.push(nextStep);
            } else {
              iteration.stash.push(nextStep);
            }
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

          iteration.stash.push(nextStep);
        }
      }
    }

    if (solutions.length > 0) {
      return solutions;
    }

    if (iteration.next.length > 0) {
      iteration.current = iteration.next;
      iteration.next = [];
    } else {
      iteration.current = iteration.stash;
      iteration.stash = [];
    }
  }
}

export default {
  name: "HelloWorld",

  methods: {
    solve_() {
      console.log("Starting solver");
      const solution = solver({
        edges: ["tai", "nec", "mfr", "hlu"],
        // edges: ["uyt", "ilf", "dbc", "noa"],
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
  border: 3px solid #000;

  width: 300px;
  height: 300px;
}
</style>
