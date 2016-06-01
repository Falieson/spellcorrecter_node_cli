// Spellchecker Coding Assignment
//
// by Florian Mettetal <florian.mettetal@gmail.com>
//
// development tasks labeled with `TOD
//
// run with:
// $ node spellcorrecter.js
//

// Modules
//
const readline = require('readline'),
      colors = require('colors/safe'),
      fs = require('fs');
      _ = require('lodash');

// Vars
//
const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
const doublebet = _.map(alphabet, (letter) => letter+letter);
const triplebet = _.map(alphabet, (letter) => letter+letter+letter);

// Utilities
//
const buildGlossary = (dictionary)=> {
  /// ["whenceeer"] has 3 consecutive Es

  const target = [...doublebet, ...triplebet];
  // console.log(`Target: ${target}`);

  let results = [];

  console.log(`Searching through  ${dictionary.length} words`);
  _.each(dictionary, (word)=> {
    const found = findPartialFromArray(word, target);
    if(found){
      // console.log(`Word: ${word}`);
      _.each(found, (res)=> results.push(res) );
    }
  });

  console.log(`Found ${results.length} Rare Words`);
  console.log(`Making up ${(results.length/dictionary.length).toFixed(2)}% of the Dictionary`);
  return results;
};
const buildIndex  = ()=> {};

const findSwappedVowel = (word, index)=> {};

const findWordInArray = (word, arr)=> {
  if(arr.every(elem => elem != word)){ return false; }
  else { return true; }
};
const findWordInJson = (word, jsn)=> {};
const findPartialFromArray = (word, target)=> {

  let results = [];
  _.each(target, (letters)=> {
    // console.log(`Letters: ${letters}`);
    found = word.indexOf(letters) >= 0;
    if(found){
      // console.log(`Found ${word} having ${letters}`);
      results.push(word);
    }
  });
  return results.length === 0 ? false : results;
};

// Checkword
//
const checkWord = (word, assets, callback)=> {
  // console.log(`Checking word: ${word} `);
  const dict = assets.dict; // array of all words
  const glossary = assets.glossary; // contains rare words
  const index = assets.index; // json a...z : ['a', 'aa'...]
  const glossaryIndex = assets.glossaryIndex; // aa...zzz: json of rare words

  let result = {
    type: "NEWSEARCH",
    data: {
      original: word,
      corrected: undefined,
    }
  };

  // console.log(`Reducing Word: ${word}`);
  // detect repeated letters
  // recursive function to remove any consecutive letters over 3
  let reducedWord = word.replace(/(.)\1{3,}/g, '$1$1$1');
  // if(reducedWord != word){ console.log(`Reduced ${word} to ${reducedWord}`); }


  // Lets see if we can find it fast in the glossary
  let rareword = findWordInArray(reducedWord, glossary);
  let foundword = false;
  if(rareword){
    // console.log(`1`);

    foundword = true;
    // reducedWord matches a rareWord, done!
    result.data.corrected = reducedWord;
    // console.log(`Word: ${word} = RW: ${reducedWord}`);
    if(word === reducedWord){
      result.type = "CORRECT";
    } else {
      result.type = "FIXED";
    }
    callback(null, result);

  }
  else {
    // console.log(`2`);

    // maybe triplicates should be duplicates
    rareword = findWordInArray(word.replace(/(.)\1{2,}/g, '$1$1'), glossary);
    if(rareword){
      foundword = true;
      result.data.corrected = word.replace(/(.)\1{2,}/g, '$1$1');
      result.type = "FIXED";
      callback(null, result);

    }
    else {
      //TODO either the word is correct
      let correctWord = false;
      if(correctWord){
        // console.log(`6`);
        foundword = true; // unnecessary

        result.type = "CORRECT";
        result.data.corrected = reducedWord;
        callback(null, result);
      } else {
        // console.log(`7`); // Not Found
        foundword = false; // unnecessary

        result.type = "NOTFOUND";
        callback(null, result);
      }
    }
  }
  // else if(!foundword){
  //   console.log(`3`);
  //
  //   // We didn't find it in the glossary,
  //   // TODO lets see if there's a problem with the vowels
  //   foundword = false;
  // }
  // else if(!foundword){
  //   console.log(`5`);
  //
  //   //TODO a combo of problems might exist
  //   foundword = false;
  // }

};
const handleWordCheck = (line, result, prompt) => {
  // console.log(`Type: ${result.type}`);
  switch (result.type) {
    case "NOTFOUND":
      console.log("NO CORRECTION");
      prompt.prompt();
      break;
    case "FIXED":
      console.log(result.data.corrected);
      prompt.prompt();
      break;
    case "CORRECT":
      const data = result.data;
      if(data.original !== data.correct){
        if(data.original.toLowerCase() === data.corrected){
          console.log(data.corrected);
        } else {
          console.error(colors.red(`How did ${data.original} become ${data.corrected}`));
        }
      }
      prompt.prompt();
      break;
    default:
      console.log(`Didn't handle ${line}`);
      prompt.prompt();
  }
};

// CLI
//
const setInterface = (assets) => {
  const prompt = readline.createInterface(process.stdin, process.stdout);
  prompt.setPrompt('> ');
  prompt.prompt();

  prompt.on('line', ( line ) => {
    if(line.trim().length > 0){
      // lowercase result
      const originalWord = line.trim();
      const word = originalWord.toLowerCase();

      checkWord(word, assets, (err, result) => {
        handleWordCheck(line, result, prompt);
      });
    } else {
      // catches spaces and empty returns
      prompt.prompt();
    }
  }).on('close', () => {
   process.exit(0);
  });
};

// START PROGRAM
//
const importDictionary = (callback)=> {
  const fsl = '/usr/share/dict/words';

  let arr = [];
  fs.readFile(fsl, (err, data)=> {
      if(err) throw err;
      arr = data.toString().split("\n");
      callback(null, arr);
  });
};
importDictionary((err, dict)=> {
  const glossary = buildGlossary(dict);
  const index = buildIndex(dict);
  const glossaryIndex = buildIndex(glossary);

  const assets = {dict, index, glossary, glossaryIndex};
  //es6 for {dict: dict, index: index}

  setInterface(assets);
});
