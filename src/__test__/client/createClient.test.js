import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const request = supertest(app)

const Client = mongoose.model('Client')

const clientProps = {
  name: 'Test Client',
}

describe('POST: /client', () => {
  it('requires authorization', done => {
    request
      .get(path('/client'))
      .send(clientProps)
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
      .post(path('/client'))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Validation failed creating client')

        done()
      })
  })

  it('creates a new client', done => {
    Client.countDocuments().then(count => {
      request
        .post(path('/client'))
        .send(clientProps)
        .set('Cookie', `accessToken=${cookie}`)
        .expect('Content-type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          Client.countDocuments()
            .then(newCount => {
              expect(newCount).toBe(count + 1)
            })
            .catch(done)

          const client = await Client.findOne({ name: 'Test Client' })

          expect(client.id).toBeTruthy()
          expect(client.name).toBe('Test Client')

          const { action, entity, data } = res.body

          expect(action).toBe('store')
          expect(entity).toBe('client')

          expect(data.entities[0].name).toBe('Test Client')

          done()
        })
    })
  })
})
