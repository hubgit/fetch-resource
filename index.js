require('isomorphic-fetch')

module.exports = function (url, params) {
  const querystring = Object.keys(params).map(function (key) {
    return [key, params[key]].map(encodeURIComponent).join('=')
  }).join('&')

  if (querystring) url += '?' + querystring

  return {
    url: url,
    json: function (options) {
      options = options || {}

      var request = new Request(url, {
        headers: new Headers({
          'Accept': 'application/json'
        })
      })

      return fetch(request).then(function (response) {
        if (response.status !== 200) {
          throw new Error('Response code ' + response.status)
        }

        if (options.data) {
          return response.json().then(function (body) {
            return options.data(response, body)
          })
        }

        return response.json()
      })
    }
  }
}

