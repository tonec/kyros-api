import restify from 'restify'
import mongoose from 'mongoose'
import helmet from 'helmet'
import im from 'is-master'
import cookieParser from 'restify-cookies'
import corsMiddleware from 'restify-cors-middleware'
import routes from './routes'
import tasks from './tasks'
import { verifyToken } from './utils'

require('dotenv').config()

process.on('unhandledRejection', error =>
  console.error('unhandledRejection error: ', error),
)

const app = restify.createServer()

mongoose.Promise = global.Promise

if (process.env.NODE_ENV !== 'test') {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
  } = process.env

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
  }

  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

  mongoose
    .connect(url, options)
    .then(() => {
      console.log('MongoDB is connected')
    })
    .catch(err => {
      console.log(err)
    })

  mongoose.set('useCreateIndex', true)

  im.start()
}

const cors = corsMiddleware({
  origins: ['http://kyros-app.com:3000'],
  credentials: true,
})

app.pre(cors.preflight)

app.use(cors.actual)

app.use(helmet())

app.use(cookieParser.parse)

app.use((req, res, next) => {
  const { accessToken } = req.cookies

  if (accessToken) {
    const verified = verifyToken(accessToken)

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

app.on('restifyError', (req, res, err, callback) => {
  err.toJSON = () => {
    return {
      ...err.body,
      cause: err.jse_cause,
    }
  }
  return callback()
})

routes(app)

tasks()

export default app
