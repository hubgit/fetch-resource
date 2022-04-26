/* global test, expect */

import resource from '..'

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

  const data = await result.fetch('json')

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

test.skip('sets the accept header', async () => {
  const result = resource('https://peerj.com/articles/1')

  const data = await result.fetch('json')

  expect(data.title).toBe('How long is a piece of loop?')
})

test('extracts data from the response', async () => {
  const result = resource('https://peerj.com/articles/index.json')

  const data = await result.fetch('json', {
    data: (res, body) => {
      return body._items
    }
  })

  expect(data).toHaveLength(10)
})

test('fetches HTML', async () => {
  const result = await resource('https://www.google.com/').fetch('html')

  expect(result).toEqual(expect.stringMatching(/^<!doctype html>/))
})

test('fetches XML', async () => {
  const result = await resource('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=28814268&retmode=xml').fetch('xml')

  expect(result).toEqual(expect.stringMatching(/^<\?xml version="1.0" \?>/))
})
