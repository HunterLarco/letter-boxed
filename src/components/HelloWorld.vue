<template>
  <div class="Host">
    <div class="Box" @click="solve_"></div>
  </div>
</template>

<script>
import dictionary from "../assets/dictionary.json";

/**
 * Given a Trie Tree, prunes it to only include words using the given letters.
 *
 * @param trie A valid Trie Tree.
 * @param {Set} letters A set of letters.
 *
 * @return A copy of the original Trie Tree only including words using the given
 *     letters.
 */
function prune(trie, letters) {
  const root = {
    children: {},
    isEnd: trie.isEnd,
  };

  for (const [letter, child] of Object.entries(trie.children)) {
    if (!letters.has(letter)) {
      // If the child branch would use an invalid letter, prune it.
      continue;
    }

    const subtree = prune(child, letters);
    if (Object.keys(subtree.children).length == 0 && !subtree.isEnd) {
      // If the subtree contains no words, prune it.
      continue;
    }

    root.children[letter] = subtree;
  }

  return root;
}

/**
 * Given the edges of a Letter Boxed puzzle, determine the set of solutions with
 * using the least number of characters.
 *
 * @param {Object} obj An object.
 * @param {Array<string>} obj.edges The edges of the puzzle. Note that any
 *     number of edges are allowed and they do not need to be uniform.
 *
 * @return {Array<Array<string>>} An array of all solutions.
 */
function letterBoxed({ edges }) {
  // To solve a Letter Boxed puzzle we...
  //
  // 1. Construct a Trie Tree from the dictionary.
  // 2. Prune the Trie to only include words using the letters in the puzzle.
  // 3. Run a breadth-first search through the Trie such that any word-end node
  //    may continue to iterate from the root node of the Trie (thereby starting
  //    a new word from the last letter of the previous word as in the puzzle).
  //
  // Of course this alone doesn't restrict the search space enough to be quick,
  // so we make a key modification to the breadth-first search:
  //
  // We first assume that there exists a solution which uses every letter
  // exactly once. During our breadth-first search, any branch which would
  // violate this assumption is stashed for later processing. If we exhaust the
  // entire search space without finding a solution that uses each letter
  // exactly once, we know that our stash includes all branches that would use a
  // at least one letter 2+ times. We then resume the breadth-first search using
  // these branches now assuming that there exists a solution which uses every
  // letter exactly once save one. Rinse and repeat.
  //
  // Using this modification we ensure that we're only every progressing the
  // search down a branch if we're confident it will contain the optimal
  // solution, rather than progressing down branches we know are unlikely to
  // yield the right solution. The reduction of the search space is orders of
  // magnitude.

  // Identify the possible letters and prune the dictionary accordingly.
  const letters = new Set(edges.join("").split(""));
  const domain = prune(dictionary, letters);

  // Stores the branches we're currently iterating over, will be next, and are
  // stashed for later.
  const iteration = {
    current: [],
    next: [],
    stash: [],
  };

  // Bootstrap the search by adding each letter in the puzzle to the currently
  // iterating branches.
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

  // Progress each current branch by one step.
  while (iteration.current.length > 0) {
    const solutions = [];
    for (const branch of iteration.current) {

      // If the current branch has progressed to a word end and has used all of
      // the letters, add it to the solutions list.
      if (branch.letters.size == letters.size && branch.node.isEnd) {
        solutions.push(branch.path);
      }

      // If a solution has already been found for this depth of the
      // breadth-first search, we can skip progressing the branch. We know any
      // solutions down this branch will exceed the optimal solution depth.
      if (solutions.length > 0) {
        continue;
      }

      // Identify all accessible letters from the current branch position.
      for (let i = 0; i < edges.length; ++i) {
        if (i == branch.edge) {
          continue;
        }

        // For each accessible letter, add a new branch containing the current
        // branch and the new letter such that the new letter is part of the
        // current word.
        for (const character of edges[i]) {
          const node = branch.node.children[character];
          const usedLetters = new Set([...branch.letters, character]);
          const newLetter = usedLetters.size > branch.letters.size;
          if (node) {
            const nextPath = [...branch.path];
            nextPath[nextPath.length - 1] += character;
            const nextBranch = {
              path: nextPath,
              letters: usedLetters,
              edge: i,
              node,
            };

            if (newLetter) {
              // If the next branch would use a letter which was previously
              // unused in the solution, slate the branch for immediate
              // iteration.
              iteration.next.push(nextBranch);
            } else {
              // If the next branch would re-use a letter, stash it for later
              // processing so that it's only enumerated once more optimal
              // branches have been exhausted.
              iteration.stash.push(nextBranch);
            }
          }
        }
      }

      // If the current branch position is at a word end, add a new branch which
      // is a duplicate of the current branch however the trie-node is reset to
      // the beginning of a new word using the last letter of the current word.
      if (branch.node.isEnd) {
        const lastWord = branch.path[branch.path.length - 1];
        const lastLetter = lastWord[lastWord.length - 1];
        const node = domain.children[lastLetter];
        if (node) {
          const nextBranch = {
            path: [...branch.path, lastLetter],
            letters: new Set([...branch.letters]),
            edge: branch.edge,
            node: node,
          };

          // Starting a new word always requires re-using at least one letter,
          // so this must always be stashed so that processing occurs once more
          // optimal branches have been exhausted.
          iteration.stash.push(nextBranch);
        }
      }
    }

    // If solutions were found, return them (thereby concluding the search).
    if (solutions.length > 0) {
      return solutions;
    }

    if (iteration.next.length > 0) {
      // If branches are slated for immediate iteration, progress them next.
      iteration.current = iteration.next;
      iteration.next = [];
    } else {
      // If no branches are slated for immediate iteration, we must have
      // exhausted all optimal branches and should resume any stashed branches.
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
      const solution = letterBoxed({
        edges: ["tai", "nec", "mfr", "hlu"],
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
