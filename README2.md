
## Install
```bash
# with npm
npm install express ejs xmlhttprequest mocha rewire supertest
``` 
 
## Run app
```bash
# use command line
node app.js
```

#### POST /api/products/autocomplete
Example:
http://localhost/api/products/autocomplete

#### POST /api/products/search
Example:
http://localhost/api/products/search

#### POST /api/products/keywords
Example: 
http://localhost/api/products/keywords

I assume all the data will be save in database of backend. So when run my application. I will read the data from file. Build Product object to save all the data.
In order to implement autocomplete. I build three trie tree, they are nameTrie, brandTrie, catogaryTrie. At the same time, I save a set in each trie node. I save all the word has the prefix in set.
With trie we can efficient find the words with that prefix. I already save the word in Set. So generate the word list is very fast. It will be O(prefix length).
To implement search, I have to traverse all the data. I traverse each fields one by one. After I get the result of one field, I just traverse the result to find match other fields. For here, I can use cache to save time. Every time go to database to search is very slow. I don't have time to implement. 
For the last, when I read data from file. I create a hashmap. Key is the word, value is the frequencies. So when I get the post. I just go to the hashmap the find the keyword. For each word, time is O(1). The total time is O(keywords.length).




