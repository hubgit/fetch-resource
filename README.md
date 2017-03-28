# fetch-resource

A wrapper for [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) that makes fetching JSON easier and handles query parameters.

## Install

```js
npm install fetch-resource
```

or

```js
yarn add fetch-resource
```

## API

```js
var resource = require('fetch-resource')

resource('https://api.github.com/search/repositories', {
    q: 'language:javascript',
    sort: 'stars',
    order: 'desc'
}).json().then(function (data) {
    // do something with data
})
```
