import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import { path } from '../utils'
import cookie from '../../test/test-cookie'

const request = supertest(app)

const Resource = mongoose.model('Resource')

describe('POST: /resource', () => {
  it('should require authorization', done => {
    request.get(path('/resource'))
      .send({
        name: 'Test Resource',
        description: 'Test description'
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
    request.post(path('/resource'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Resource not created')

        done()
      })
  })

  it('A POST should create a new resource', done => {
    Resource.countDocuments().then(count => {
      request.post(path('/resource'))
        .send({
          name: 'Test Resource',
        })
        .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
        .expect('Content-type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          Resource.countDocuments()
            .then(newCount => {
              expect(newCount).toBe(count + 1)
            })
            .catch(done)

          const resource = await Resource.findOne({ name: 'Test Resource' })

          expect(resource.id).toBeTruthy()
          expect(resource.name).toBe('Test Resource')

          const { action, entity, data } = res.body

          expect(action).toBe('store')
          expect(entity).toBe('resource')

          expect(data.entities[0].name).toBe('Test Resource')

          done()
        })
    })
  })
})

describe('GET: /resource/:id', () => {
  let id

  beforeEach(async done => {
    const result = await new Resource({ name: 'Test Resource' }).save()
    id = `${result._id}`
    done()
  })

  it('A GET to /resource/:id should require authorization', done => {
    request.get(path(`/resource/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('should return the resource with that id', async done => {
    request.get(path(`/resource/${id}`))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('resource')

        expect(data.entities[0].id).toBe(id)
        expect(data.entities[0].name).toBe('Test Resource')

        done()
      })
  })
})

describe('GET: /resource', () => {
  let resourceOne
  let resourceTwo

  beforeEach(done => {
    resourceOne = new Resource({ name: 'Test Resource 1' })
    resourceTwo = new Resource({ name: 'Test Resource 2' })

    Promise.all([resourceOne.save(), resourceTwo.save()]).then(() => done())
  })

  it('A GET to /resource should require authorization', done => {
    request.get(path('/resource'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /resource should return a list of resources', done => {
    request.get(path('/resource'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('resource')
        expect(data.entities.length).toBe(2)

        done()
      })
  })
})

describe('PATCH: /resource/:id', () => {
  let resourceOne
  let resourceTwo

  beforeEach(done => {
    resourceOne = new Resource({ name: 'Test Resource 1' })
    resourceTwo = new Resource({ name: 'Test Resource 2' })

    Promise.all([resourceOne.save(), resourceTwo.save()]).then(() => done())
  })

  it('should require authorization', done => {
    request.get(path('/resource'))
      .send({
        name: 'Test Resource',
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

  it('A PATCH should update the resource', done => {
    request.patch(path(`/resource/${resourceOne._id}`))
      .send({ name: 'New Resource Name' })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const resource = await Resource.findById(resourceOne._id)

        expect(resource.name).toBe('New Resource Name')

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('resource')

        expect(data.entities[0].name).toBe('New Resource Name')

        done()
      })
  })
})
