/**
 * Given a Trie Tree, prunes it to only include words using the given letters.
 *
 * @param trie A valid Trie Tree.
 * @param {Function} predicate A predicate which filters nodes on the trie.
 *
 * @return A copy of the original Trie Tree only including words using the given
 *     letters.
 */
export function prune(trie, predicate) {
  return pruneInternal(trie, predicate, null);
}

/**
 * Given a Trie Tree, prunes it to only include words using the given letters.
 *
 * @param trie A valid Trie Tree.
 * @param {Function} predicate A predicate which filters nodes on the trie.
 * @param {String|null } previousLetter The previous letter (if any) during
 *     recursion.
 *
 * @return A copy of the original Trie Tree only including words using the given
 *     letters.
 */
function pruneInternal(trie, predicate, previousLetter) {
  const root = {
    children: {},
    isEnd: trie.isEnd,
  };

  for (const [letter, child] of Object.entries(trie.children)) {
    if (!predicate(letter, previousLetter)) {
      // If the child branch would fail the predicate, prune it.
      continue;
    }

    const subtree = pruneInternal(child, predicate, letter);
    if (Object.keys(subtree.children).length == 0 && !subtree.isEnd) {
      // If the subtree contains no words, prune it.
      continue;
    }

    root.children[letter] = subtree;
  }

  return root;
}

/**
 * Returns statistics for the trie tree.
 *
 * @param trie The trie tree.
 *
 * @return {Object} Statistics.
 */
export function statistics(trie) {
  const stats = {
    wordCount: trie.isEnd ? 1 : 0,
    totalLetters: 1,
    maxDepth: 1,
  };

  for (const [letter, child] of Object.entries(trie.children)) {
    const subStats = statistics(child);
    stats.wordCount += subStats.wordCount;
    stats.totalLetters += subStats.totalLetters;
    stats.maxDepth = Math.max(1 + subStats.maxDepth, stats.maxDepth);
  }

  return stats;
}
