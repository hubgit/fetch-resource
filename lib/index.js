/* global Headers, Request, fetch */

import 'isomorphic-fetch'

const acceptType = function (format) {
  switch (format) {
    case 'json':
      return 'application/json'

    case 'text':
      return 'text/plain'

    case 'html':
      return 'text/html'

    case 'xml':
      return 'application/xml'

    default:
      return '*/*'
  }
}

const contentType = function (response) {
  const header = response.headers.get('content-type')

  if (header.indexOf('application/json') !== -1) {
    return 'json'
  }

  if (header.indexOf('text/plain') !== -1) {
    return 'text'
  }

  if (header.indexOf('text/html') !== -1) {
    return 'html'
  }

  if (header.indexOf('application/xml') !== -1) {
    return 'xml'
  }

  return null
}

const parse = function (response, format) {
  switch (format) {
    case 'json':
      return response.json()

    case 'text':
    case 'html':
    case 'xml':
      return response.text()

    default:
      return Promise.resolve(response)
  }
}

const resource = function (url, params) {
  params = params || {}

  const querystring = Object.keys(params).map(function (key) {
    return [key, params[key]].map(encodeURIComponent).join('=')
  }).join('&')

  if (querystring) url += '?' + querystring

  return {
    url: url,

    fetch: function (format, options) {
      options = options || {}

      const request = new Request(url, {
        headers: new Headers({
          'Accept': acceptType(format)
        })
      })

      return fetch(request).then(function (response) {
        if (response.status !== 200) {
          throw new Error('Response code ' + response.status)
        }

        if (!format) {
          format = contentType(response)
        }

        return parse(response, format).then(function (body) {
          return options.data ? options.data(response, body) : body
        })
      })
    },

    update: function (body) {
      const request = new Request(url, {
        method: 'PATCH',
        body: body
      })

      return fetch(request).then(function (response) {
        if (response.status < 200 || response.status > 204) {
          throw new Error('Response code ' + response.status)
        }
      })
    },

    create: function (body, options) {
      const request = new Request(url, {
        method: 'POST',
        body: body
      })

      return fetch(request).then(function (response) {
        if (response.status !== 201) {
          throw new Error('Response code ' + response.status)
        }

        const location = response.headers.get('Location')

        return resource(location)
      })
    },

    kill: function (options) {
      const request = new Request(url, {
        method: 'DELETE'
      })

      return fetch(request).then(function (response) {
        if (response.status !== 204) {
          throw new Error('Response code ' + response.status)
        }
      })
    }
  }
}

export default resource

