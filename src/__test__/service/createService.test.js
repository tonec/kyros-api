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

describe('POST: /service', () => {
  let client

  beforeEach(done => {
    client = new Client(clientProps)
    client.save().then(() => done())
  })

  it('requires authorization', done => {
    request
      .get(path('/service'))
      .send({
        name: 'Test Service',
        description: 'Test description',
        client: client._id,
      })
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('missing name is rejected', async done => {
    request
      .post(path('/service'))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Validation failed creating service')

        done()
      })
  })

  it('creates a new service', done => {
    Service.countDocuments().then(count => {
      request
        .post(path('/service'))
        .send({
          name: 'Test Service',
          description: 'Some description',
          client: client._id,
        })
        .set('Cookie', `accessToken=${cookie}`)
        .expect('Content-type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          Service.countDocuments()
            .then(newCount => {
              expect(newCount).toBe(count + 1)
            })
            .catch(done)

          const service = await Service.findOne({ name: 'Test Service' })

          expect(service.id).toBeTruthy()
          expect(service.name).toBe('Test Service')

          const { action, entity, data } = res.body

          expect(action).toBe('store')
          expect(entity).toBe('service')

          expect(data.entities[0].name).toBe('Test Service')

          done()
        })
    })
  })
})
