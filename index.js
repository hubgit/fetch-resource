require('isomorphic-fetch')

module.exports = function (url, params) {
  if (params) {
    url += '?' + Object.keys(params).map(function (key) {
      return [key, params[key]].map(encodeURIComponent).join('=')
    }).join('&')
  }

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

        const parse = response.json()

        if (options.data) {
          return parse.then(function (body) {
            return options.data(response, body)
          })
        }

        return parse
      })
    }
  }
}
