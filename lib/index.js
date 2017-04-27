require('isomorphic-fetch')

const acceptType = function (format) {
  switch (format) {
    case 'json':
      return 'application/json'
    case 'text':
      return 'text/plain'
    default:
      return '*/*'
  }
}

const contentType = function (response) {
  const contentType = response.headers.get('content-type')

  if (contentType.indexOf('application/json') !== -1) {
    return 'json'
  }

  if (contentType.indexOf('text/plain') !== -1) {
    return 'text'
  }

  return null
}

const parse = function (response, format) {
  switch (format) {
    case 'json':
      return response.json()

    case 'text':
      return response.text()

    default:
      return Promise.resolve(response)
  }
}

module.exports = function (url, params) {
  params = params || {}

  const querystring = Object.keys(params).map(function (key) {
    return [key, params[key]].map(encodeURIComponent).join('=')
  }).join('&')

  if (querystring) url += '?' + querystring

  return {
    url: url,
    fetch: function (format, options) {
      options = options || {}

      var request = new Request(url, {
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

    json: function (options) {
      return this.fetch('json', options)
    },
  }
}

