* prompt with node
* loop until cmd+c
* import /usr/share/dict/words
* two indexes: alphabet with key [a...z], and glossary of words with 2 or 3 consecutive letters
** what about two indexes: with key first 2 letters [a...zzz], and other index with key last 2 letters and match to create an array of possibilities. Then look for duplicate in array (this is a high probable match), check the Request against the duplicate array to see if the word is correct. If not try some modifications against the Request and see if it matches something in the array. Advantage is removing dependency on first letter correct.
