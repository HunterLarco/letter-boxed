import * as trie from "./trieUtil.js";
import dictionary from "../assets/dictionary.json";

/**
 * Given the edges of a letter boxed puzzle, create a predicate which can be
 * used to prune the dictionary so that it only contains valid words within the
 * puzzle.
 *
 * @param {Array<string>} edges The edges of the puzzle. Note that any number of
 *     edges are allowed and they do not need to be uniform.
 *
 * @return {Function} The predicate for use with `prune`.
 */
function createPruningPredicate(edges) {
  // Create a mapping of each letter in the puzzle to the set of letters
  // accessible from that letter.
  const letters = new Map();

  for (let i = 0; i < edges.length; ++i) {
    for (const letter of edges[i]) {
      const accessible = new Set();
      for (let j = 0; j < edges.length; ++j) {
        if (j != i) {
          [...edges[j]].forEach((l) => accessible.add(l));
        }
      }
      letters.set(letter, accessible);
    }
  }

  return (letter, previousLetter) =>
    letters.has(letter) &&
    (previousLetter == null ||
      (letters.has(previousLetter) && letters.get(previousLetter).has(letter)));
}

export const LetterBoxedMode = {
  MinLetters: Symbol("MinLetters"),
  TwoWords: Symbol("TwoWords"),
};

/**
 * Given the edges of a Letter Boxed puzzle, determine the set of solutions with
 * using the least number of characters.
 *
 * @param {Object} obj An object.
 * @param {Array<string>} obj.edges The edges of the puzzle. Note that any
 *     number of edges are allowed and they do not need to be uniform.
 * @param {LetterBoxedMode} obj.mode The optimization strategy of the solver.
 *
 * @return {Array<Array<string>>} An array of all solutions.
 */
export function letterBoxed(obj) {
  const { edges = [], mode = LetterBoxedMode.MinLetters } = obj;

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

  console.log("Before pruning", trie.statistics(dictionary));
  const letters = new Set(edges.join("").split(""));
  const domain = trie.prune(dictionary, createPruningPredicate(edges));
  console.log("After pruning", trie.statistics(domain));

  // Stores the branches we're currently iterating over, will be next, and are
  // stashed for later.
  const iteration = {
    current: [],
    next: [],
    charStash: [],
    wordStash: [],
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
              iteration.charStash.push(nextBranch);
            }
          }
        }
      }

      // If the current branch position is at a word end, add a new branch which
      // is a duplicate of the current branch however the trie-node is reset to
      // the beginning of a new word using the last letter of the current word.
      if (branch.node.isEnd) {
        if (mode == LetterBoxedMode.TwoWords && branch.path.length == 2) {
          continue;
        }

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
          iteration.charStash.push(nextBranch);
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
    } else if (iteration.charStash.length > 0) {
      // If no branches are slated for immediate iteration, we must have
      // exhausted all optimal branches and should resume any stashed branches.
      iteration.current = iteration.charStash;
      iteration.charStash = [];
    } else {
      // If no branches are slated for immediate iteration, we must have
      // exhausted all optimal branches and should resume any stashed branches.
      iteration.current = iteration.wordStash;
      iteration.wordStash = [];
    }
  }

  return [];
}
