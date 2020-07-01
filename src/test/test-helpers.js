import mongoose from 'mongoose'
import request from 'supertest'
import config from '../../config'

const path = config.basePath

before(done => {
  mongoose.connect(config.db.testUri)
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
    .set('Cookie', `viatorem=${JSON.stringify(loginResponse)}`)
    .send(props)
)
