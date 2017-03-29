# fetch-resource

[![Greenkeeper badge](https://badges.greenkeeper.io/hubgit/fetch-resource.svg)](https://greenkeeper.io/)

A wrapper for [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) that makes fetching JSON easier and handles query parameters.

## Install

```js
npm install fetch-resource
```

or

```js
yarn add fetch-resource
```

## Usage

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

### Usage in Next.js

```js
import resource from 'fetch-resource'

const Page = ({items}) => (
  <div>
    {items.map(item => (
      <div><a href={item.html_url}>{item.name}</a>: {item.stargazers_count}</div>
    ))}
  </div>
)

Page.getInitialProps = () => {
  return resource('https://api.github.com/search/repositories', {
    q: 'language:javascript',
    sort: 'stars',
    order: 'desc'
  }).json()
}
```
