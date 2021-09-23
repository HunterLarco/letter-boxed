#!/usr/bin/env node

const readline = require('readline');

function createTrieNode() {
  return {
    children: {},
    isEnd: false,
  }
}

function createTrie(words) {
  const root = createTrieNode();

  for (const word of words) {
    let node = root;
    for (const character of word) {
      if (!node.children[character]) {
        node.children[character] = createTrieNode();
      }
      node = node.children[character];
    }
    node.isEnd = true;
  }

  return root;
}

function main() {
  const terminalInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
  });

  const words = [];
  terminalInterface.on('line', function(line){
    words.push(line.trim());
  })

  terminalInterface.on('close', function(){
    const trie = createTrie(words);
    console.log(JSON.stringify(trie));
  })
}

main();
