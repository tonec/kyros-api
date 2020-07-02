import mongoose from 'mongoose'
import request from 'supertest'
import config from '../../config'

const path = config.basePath

before(done => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true }

  mongoose.connect(config.db.testUri, options)

  mongoose.set('useCreateIndex', true)

  mongoose.connection
    .once('open', () => {
      console.log('Mongo connection open')
      done()
    })
    .on('error', error => {
      console.warn('Warning: ', error)
    })
})

beforeEach(done => {
  mongoose.connection.db.dropDatabase(() => done())
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
          login: login.body
        }))
    )

export const createTrip = api => (loginResponse, props) => (
  request(api)
    .post(path('/trips'))
    .set('Cookie', `kyros=${JSON.stringify(loginResponse)}`)
    .send(props)
)
