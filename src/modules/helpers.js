export const request = requestParams =>
  new Promise((resolve, reject) => {
    const lib = requestParams.type.startsWith('https:')
      ? require('https')
      : require('http')
    const req = lib.request(requestParams, res => {
      const body = []

      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(
          new Error(
            `Failed to load url: ${requestParams.path}. Status code: ${
              res.statusCode
            }`
          )
        )
      }

      res.on('data', chunk => body.push(chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(body).toString()))
        } catch (error) {
          console.log('Error parsing request response')
        }
      })
    })

    req.end()
    req.on('error', error => reject(error))
  })

export const queryString = options => {
  let qs = ''

  Object.keys(options).forEach(key => {
    qs = qs.concat(key, '=', options[key], '&')
  })

  return `?${encodeURI(qs.slice(0, -1))}`
}
