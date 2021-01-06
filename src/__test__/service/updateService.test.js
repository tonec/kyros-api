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

describe('PATCH: /service/:id', () => {
  let serviceOne
  let serviceTwo

  beforeEach(async done => {
    const client = await new Client(clientProps)
    serviceOne = new Service({ name: 'Test Service 1', client: client._id })
    serviceTwo = new Service({ name: 'Test Service 2', client: client._id })

    Promise.all([serviceOne.save(), serviceTwo.save()]).then(() => done())
  })

  it('should require authorization', done => {
    request
      .get(path('/service'))
      .send({
        name: 'Test Service',
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

  it('A PATCH should update the service', done => {
    request
      .patch(path(`/service/${serviceOne._id}`))
      .send({ name: 'New Service Name' })
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const service = await Service.findById(serviceOne._id)

        expect(service.name).toBe('New Service Name')

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('service')

        expect(data.entities[0].name).toBe('New Service Name')

        done()
      })
  })
})
