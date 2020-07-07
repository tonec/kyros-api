import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import { path } from '../utils'
import cookie from '../../test/test-cookie'

const request = supertest(app)

const Client = mongoose.model('Client')

describe('POST: /client', () => {
  it('should require authorization', done => {
    request.get(path('/client'))
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

  it('A POST with missing name should be a bad request', async done => {
    request.post(path('/client'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Client not created')

        done()
      })
  })

  it('A POST should create a new client', done => {
    Client.countDocuments().then(count => {
      request.post(path('/client'))
        .send({
          name: 'Test Client',
        })
        .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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

describe('GET: /client/:id', () => {
  let id

  beforeEach(async done => {
    const result = await new Client({ name: 'Test Client' }).save()
    id = `${result._id}`
    done()
  })

  it('A GET to /client/:id should require authorization', done => {
    request.get(path(`/client/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('should return the client with that id', async done => {
    request.get(path(`/client/${id}`))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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

describe('GET: /client', () => {
  let clientOne
  let clientTwo

  beforeEach(done => {
    clientOne = new Client({ name: 'Test Client 1' })
    clientTwo = new Client({ name: 'Test Client 2' })

    Promise.all([clientOne.save(), clientTwo.save()]).then(() => done())
  })

  it('A GET to /client should require authorization', done => {
    request.get(path('/client'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /client should return a list of clients', done => {
    request.get(path('/client'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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

describe('PATCH: /client/:id', () => {
  let clientOne
  let clientTwo

  beforeEach(done => {
    clientOne = new Client({ name: 'Test Client 1' })
    clientTwo = new Client({ name: 'Test Client 2' })

    Promise.all([clientOne.save(), clientTwo.save()]).then(() => done())
  })

  it('should require authorization', done => {
    request.get(path('/client'))
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
    request.patch(path(`/client/${clientOne._id}`))
      .send({ name: 'New Client Name' })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
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
