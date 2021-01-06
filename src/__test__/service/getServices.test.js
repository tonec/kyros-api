import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const Client = mongoose.model('Client')
const Service = mongoose.model('Service')

const request = supertest(app)

const clientProps = {
  name: 'Test client',
}

describe('GET: /service', () => {
  let serviceOne
  let serviceTwo

  beforeEach(async done => {
    const client = await new Client(clientProps)
    serviceOne = new Service({ name: 'Test Service 1', client: client._id })
    serviceTwo = new Service({ name: 'Test Service 2', client: client._id })

    Promise.all([serviceOne.save(), serviceTwo.save()]).then(() => done())
  })

  it('A GET to /service should require authorization', done => {
    request
      .get(path('/service'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /service should return a list of service', done => {
    request
      .get(path('/service'))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('service')
        expect(data.entities.length).toBe(2)

        done()
      })
  })
})
