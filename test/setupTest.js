import 'babel-polyfill'
import mongoose from 'mongoose'
import request from 'supertest'
import { path } from '../src/utils'

beforeAll(async done => {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
  } = process.env

  const options = { useNewUrlParser: true, useUnifiedTopology: true }

  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}_test?authSource=admin`

  mongoose.connect(url, options)

  mongoose.set('useCreateIndex', true)

  mongoose.connection
    .once('open', () => {
      // console.log('Mongo connection open')
      done()
    })
    .on('error', error => {
      console.warn('Warning: ', error)
    })
})

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

afterEach(async () => {
  await removeAllCollections()
})

export const registerAndLoginUser = api => userProps =>
  request(api)
    .post(path('/auth/register'))
    .send(userProps)
    .then(registration =>
      request(api)
        .post(path('/auth/login'))
        .send(userProps)
        .then(login => ({
          registration: registration.body,
          login: login.body,
        })),
    )
