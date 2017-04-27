const resource = require('../lib')
const nextLink = require('next-link-header')

describe('module', () => {
  test('sets a url', () => {
    const result = resource('https://api.github.com/search/repositories')

    expect(result.url)
      .toBe('https://api.github.com/search/repositories')
  })

  test('adds an encoded query string to a url', () => {
    const result = resource()._build('https://api.github.com/search/repositories', {
      q: 'language:javascript',
      sort: 'stars',
      order: 'desc'
    })

    expect(result)
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

  test('fetches an array using "fetch"', async () => {
    const result = resource('https://api.github.com/search/repositories', {
      q: 'language:javascript',
      sort: 'stars',
      order: 'desc'
    })

    const data = await result.fetch('json')

    expect(data.items).toHaveLength(30)
    expect(typeof data.total_count).toBe('number')
  })

  test('detects the response format', async () => {
    const result = resource('https://api.github.com/search/repositories', {
      q: 'language:javascript',
      sort: 'stars',
      order: 'desc'
    })

    const data = await result.fetch()

    expect(data.items).toHaveLength(30)
    expect(typeof data.total_count).toBe('number')
  })

  test('sets the accept header', async () => {
    const result = resource('https://peerj.com/articles/1')

    const data = await result.json()

    expect(data.title).toBe('How long is a piece of loop?')
  })

  test('extracts data from the response', async () => {
    const result = resource('https://api.github.com/search/repositories', {
      q: 'language:javascript',
      sort: 'stars',
      order: 'desc'
    })

    const data = await result.json({
      data: (response, body) => body.items
    })

    expect(data).toHaveLength(30)
  })

  test('fetches a paginated array', async () => {
    const result = resource('https://api.github.com/search/repositories', {
      q: 'language:javascript',
      sort: 'stars',
      order: 'desc'
    })

    const pages = await result.fetch('json', {
      data: (response, body) => body.items,
      next: nextLink,
      limit: 3
    })

    let counter = 0

    // for await (const page of pages) {
    for (const page of pages) {
      const data = await page
      expect(data).toHaveLength(30)
      counter++
    }

    expect(counter).toBe(3)
  })
})
