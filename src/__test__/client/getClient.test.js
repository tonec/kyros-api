import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const request = supertest(app)

const Client = mongoose.model('Client')

describe('GET: /client/:id', () => {
  let id

  beforeEach(async done => {
    const result = await new Client({ name: 'Test Client' }).save()
    id = `${result._id}`
    done()
  })

  it('requires authorization', done => {
    request
      .get(path(`/client/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('returns the client', async done => {
    request
      .get(path(`/client/${id}`))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('client')

        expect(data.entities[0].id).toBe(id)
        expect(data.entities[0].name).toBe('Test Client')

        done()
      })
  })
})
