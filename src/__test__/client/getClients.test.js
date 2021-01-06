import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const request = supertest(app)

const Client = mongoose.model('Client')

describe('GET: /client', () => {
  let clientOne
  let clientTwo

  beforeEach(done => {
    clientOne = new Client({ name: 'Test Client 1' })
    clientTwo = new Client({ name: 'Test Client 2' })

    Promise.all([clientOne.save(), clientTwo.save()]).then(() => done())
  })

  it('requires authorization', done => {
    request
      .get(path('/client'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('returns a list of clients', done => {
    request
      .get(path('/client'))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('client')
        expect(data.entities.length).toBe(2)

        done()
      })
  })
})
