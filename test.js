const resource = require('./')

test('sets a url', () => {
  const result = resource('https://api.github.com/search/repositories')

  expect(result.url)
    .toBe('https://api.github.com/search/repositories')
})

test('adds an encoded query string to the url', () => {
  const result = resource('https://api.github.com/search/repositories', {
    q: 'language:javascript',
    sort: 'stars',
    order: 'desc'
  })

  expect(result.url)
    .toBe('https://api.github.com/search/repositories?q=language%3Ajavascript&sort=stars&order=desc')
})

test('fetches an array', async () => {
  const result = resource('https://api.github.com/search/repositories', {
    q: 'language:javascript',
    sort: 'stars',
    order: 'desc'
  })

  const data = await result.json()

  expect(data.items).toHaveLength(30)
  expect(typeof data.total_count).toBe('number')
})

test('sets the accept header', async () => {
  const result = resource('https://peerj.com/articles/1')

  const data = await result.json()

  expect(data.title).toBe('How long is a piece of loop?')
})
