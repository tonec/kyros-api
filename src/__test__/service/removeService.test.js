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

describe('DELETE: /service/:id', () => {
  let serviceOne
  let serviceTwo

  beforeEach(async done => {
    const client = await new Client(clientProps)
    serviceOne = new Service({ name: 'Test Service 1', client: client._id })
    serviceTwo = new Service({ name: 'Test Service 2', client: client._id })

    Promise.all([serviceOne.save(), serviceTwo.save()]).then(() => done())
  })

  it('requires authorization', done => {
    request
      .delete(path(`/service/${serviceOne._id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('removes the service', async done => {
    const service = await Service.findById(serviceOne._id)
    expect(service.name).toBe('Test Service 1')

    request
      .delete(path(`/service/${serviceOne._id}`))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const service = await Service.findById(serviceOne._id)

        expect(service).toBeNull()

        done()
      })
  })
})
