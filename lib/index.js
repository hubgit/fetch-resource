require('isomorphic-fetch')

class Resource {
  constructor (url, params) {
    this.url = url
    this.params = params
  }

  json (options) {
    return this.fetch('json', options)
  }

  fetch (format, options) {
    options = options || {}

    if (options.next) {
      return this._fetchAll(format, options)
    }

    return this._fetch(this.url, this.params, format, options)
      .then(({ data }) => data)
  }

  * _fetchAll (format, options) {
    let url = this.url
    let params = this.params
    let next
    let counter = 0

    do {
      yield this._fetch(url, params, format, options).then((result) => {
        next = result.next

        switch (typeof next) {
          case 'string':
            url = next
            params = {}
            break

          case 'object':
            Object.assign(params, next)
            break
        }

        return result.data
      })

      if (options.limit && ++counter >= options.limit) {
        break
      }
    } while (next)
  }

  async _fetch (url, params, format, options) {
    var request = new Request(this._build(url, params), {
      headers: new Headers({
        'Accept': this._acceptType(format)
      })
    })

    const response = await fetch(request)

    if (response.status !== 200) {
      throw new Error('Response code ' + response.status)
    }

    const body = await this._parse(response, format)

    const data = options.data ? options.data(response, body) : body
    const next = options.next ? options.next(response, body) : null

    return { data, next }
  }

  _build (url, params) {
    const querystring = Object.keys(params || {}).filter(key => {
      return params[key] !== null && params[key] !== undefined
    }).map(key => {
      return [key, params[key]].map(encodeURIComponent).join('=')
    }).join('&')

    return querystring ? url + '?' + querystring : url
  }

  _acceptType (format) {
    switch (format) {
      case 'json':
        return 'application/json'

      case 'text':
        return 'text/plain'

      default:
        return '*/*'
    }
  }

  _contentType (response) {
    const contentType = response.headers.get('content-type')

    if (contentType.indexOf('application/json') !== -1) {
      return 'json'
    }

    if (contentType.indexOf('text/plain') !== -1) {
      return 'text'
    }

    return null
  }

  _parse (response, format) {
    if (!format) {
      format = this._contentType(response)
    }

    switch (format) {
      case 'json':
        return response.json()

      case 'text':
        return response.text()

      default:
        return Promise.resolve(response)
    }
  }
}

module.exports = (url, params) => new Resource(url, params)

