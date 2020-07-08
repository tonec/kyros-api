import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import { path } from '../utils'
import cookie from '../../test/test-cookie'

const Client = mongoose.model('Client')
const Service = mongoose.model('Service')

const request = supertest(app)

const clientProps = {
  name: 'Test client'
}

describe('POST: /service', () => {
  let client

  beforeEach(done => {
    client = new Client(clientProps)
    client.save().then(() => done())
  })

  it('should require authorization', done => {
    request.get(path('/service'))
      .send({
        name: 'Test Service',
        description: 'Test description',
        client: client._id
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

  it('A POST with missing name should be a bad request', async done => {
    request.post(path('/service'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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

  it('A POST should create a new service', done => {
    Service.countDocuments().then(count => {
      request.post(path('/service'))
        .send({
          name: 'Test Service',
          description: 'Some description',
          client: client._id
        })
        .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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

describe('GET: /service/:id', () => {
  let id

  beforeEach(async done => {
    const client = await new Client(clientProps)
    const result = await new Service({ name: 'Test Service', client: client._id }).save()
    id = `${result._id}`
    done()
  })

  it('A GET to /service/:id should require authorization', done => {
    request.get(path(`/service/${id}`))
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
    request.get(path(`/service/${id}`))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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
    request.get(path('/service'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /service should return a list of service', done => {
    request.get(path('/service'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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
    request.get(path('/service'))
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
    request.patch(path(`/service/${serviceOne._id}`))
      .send({ name: 'New Service Name' })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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
