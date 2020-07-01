import restify from 'restify'
import mongoose from 'mongoose'
import im from 'is-master'
import cookieParser from 'restify-cookies'
import paginate from 'restify-paginate'
import routes from './routes'
import tasks from './tasks'
import verifyToken from './utils/verifyToken'

const port = process.env.PORT || process.env.APIPORT || 8080

process.on('unhandledRejection', error => console.error('unhandledRejection error: ', error))

const app = restify.createServer()

mongoose.Promise = global.Promise

if (process.env.NODE_ENV !== 'test') {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env

  const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000
  }

  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

  mongoose.connect(url, options)
    .then(() => {
      console.log('MongoDB is connected')
    })
    .catch((err) => {
      console.log(err)
    })

  im.start()
}

app.get(
  /\/dist\/(.*)?.*/,
  restify.plugins.serveStatic({
    directory: './dist',
    appendRequestPath: false
  })
)

app.use(cookieParser.parse)

app.use((req, res, next) => {
  const { viatorem } = req.cookies
  const cookie = viatorem ? JSON.parse(viatorem) : null

  if (cookie && cookie.accessToken) {
    const verified = verifyToken(cookie.accessToken)
    if (!verified) {
      req.user = null
    }
    req.user = verified
    next()
  } else {
    req.user = null
    next()
  }
})

app.use(restify.plugins.acceptParser(app.acceptable))
app.use(restify.plugins.queryParser({ mapParams: true }))
app.use(restify.plugins.bodyParser({ mapParams: false }))
app.use(paginate(app))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  return next()
})

routes(app)
tasks()

if (port) {
  app.listen(port, err => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> 🌎  API is running on port %s', port)
    console.info(
      '==> 💻  Send requests to http://localhost:%s',
      port
    )
  })
} else {
  console.error(
    '==>     ERROR: No APIPORT environment variable has been specified'
  )
}

export default app
