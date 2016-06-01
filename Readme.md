# Word Correction Take-Home #

Write a program in JavaScript that reads a large list of English words (e.g. from /usr/share/dict/words on a unix system) into memory, and then reads words from stdin, and prints either the best spelling correction, or "NO CORRECTION" if no suitable correction can be found.

The program should print "> " as a prompt before reading each word, and should loop until killed.

# Run Program #
```
$ node ./spellcorrecter.js
> sheeeeep
sheep
> CUNsperrICY
conspiracy
> sheeple
NO CORRECTION
```



# Mistake Types #
The class of spelling mistakes to be corrected is as follows:

1. Case (upper/lower) errors 'inSIDE -> inside'
2. Repeated letters 'jjoobbb -> job'
3. Incorrect vowels 'weke -> wake'
4. Any combination of the above types of errors 'CUNsperrICY -> conspiracy'


Your solution should be faster than O(n) per word checked, where n is the length of the dictionary. That is to say, you can't scan the dictionary every time you want to spellcheck a word.

If there are many possible corrections of an input word, your program can choose one in any way you like, however your results *must* match the examples above (e.g. "sheeeeep" should return "sheep" and not "shap").

# Incorrect Word Generator #

Write a second program that generates words with spelling mistakes of the above form, starting with correctly spelled English words. Pipe its output int
