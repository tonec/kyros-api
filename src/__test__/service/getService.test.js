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

describe('GET: /service/:id', () => {
  let id

  beforeEach(async done => {
    const client = await new Client(clientProps)
    const result = await new Service({
      name: 'Test Service',
      client: client._id,
    }).save()
    id = `${result._id}`
    done()
  })

  it('A GET to /service/:id should require authorization', done => {
    request
      .get(path(`/service/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('should return the service with that id', async done => {
    request
      .get(path(`/service/${id}`))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('service')

        expect(data.entities[0].id).toBe(id)
        expect(data.entities[0].name).toBe('Test Service')

        done()
      })
  })
})
