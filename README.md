# fetch-resource

A wrapper for [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) that makes fetching JSON easier and handles query parameters.

## Install

```sh
npm install fetch-resource
```

or

```sh
yarn add fetch-resource
```

## Usage

```js
const resource = require('fetch-resource')

const params = {
  q: 'language:javascript',
  sort: 'stars',
  order: 'desc'
}

resource('https://api.github.com/search/repositories', params)
  .fetch('json')
  .then(data => { })
```

### Methods: fetch, update, create, kill

```js
const resource = require('fetch-resource')

(async function () {
  // a resource representing the collection
  const collection = resource('https://example.com/items')
  
  // create a new item and store the location
  const url = await collection.create({
    title: 'foo'
  })
  
  // a resource representing the item
  const item = resource(url)
  
  // update the item
  await item.update({
    title: 'bar'
  })
  
  // fetch the updated data
  const data = await item.fetch('json')
  
  // delete the item
  await item.kill()
})()
```

### Usage in Next.js

```jsx
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
  }).fetch('json')
}
```
