require('isomorphic-fetch')

const acceptType = function (format) {
  switch (format) {
    case 'json':
      return 'application/json'

    case 'text':
      return 'text/plain'

    case 'html':
      return 'text/html'

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

  return null
}

const parse = function (response, format) {
  switch (format) {
    case 'json':
      return response.json()

    case 'text':
      return response.text()

    case 'html':
      return response.text() // TODO: optional HTML parser?

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

    update: function (body) {
      var request = new Request(url, {
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
      var request = new Request(url, {
        method: 'POST',
        body: body
      })

      return fetch(request).then(function (response) {
        if (response.status !== 201) {
          throw new Error('Response code ' + response.status)
        }

        return response.headers.get('Location')
      })
    },

    kill: function (options) {
      var request = new Request(url, {
        method: 'DELETE',
      })

      return fetch(request).then(function (response) {
        if (response.status !== 204) {
          throw new Error('Response code ' + response.status)
        }
      })
    }
  }
}

