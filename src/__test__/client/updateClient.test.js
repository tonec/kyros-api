import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const request = supertest(app)

const Client = mongoose.model('Client')

describe('PATCH: /client/:id', () => {
  let clientOne
  let clientTwo

  beforeEach(done => {
    clientOne = new Client({ name: 'Test Client 1' })
    clientTwo = new Client({ name: 'Test Client 2' })

    Promise.all([clientOne.save(), clientTwo.save()]).then(() => done())
  })

  it('should require authorization', done => {
    request
      .get(path('/client'))
      .send({
        name: 'Test Client',
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

  it('A PATCH should update the client', done => {
    request
      .patch(path(`/client/${clientOne._id}`))
      .send({ name: 'New Client Name' })
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const client = await Client.findById(clientOne._id)

        expect(client.name).toBe('New Client Name')

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('client')

        expect(data.entities[0].name).toBe('New Client Name')

        done()
      })
  })
})
