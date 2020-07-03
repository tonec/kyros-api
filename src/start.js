import app from './app'

const port = process.env.API_PORT || 8080

if (port) {
  app.listen(port, err => {
    if (err) {
      console.error(err)
    }
    console.info(`API is running on port ${port}`)
    console.info(`Send requests to http://localhost:${port}`)
  })
} else {
  console.error('No APIPORT environment variable has been specified')
}
