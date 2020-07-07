import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import { path } from '../utils'
import cookie from '../../test/test-cookie'

const request = supertest(app)

const ResourceType = mongoose.model('ResourceType')

describe('POST: /resourcetype', () => {
  it('should require authorization', done => {
    request.get(path('/resourcetype'))
      .send({
        name: 'Test ResourceType'
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
    request.post(path('/resourcetype'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Resource type not created')

        done()
      })
  })

  it('A POST should create a new resource type', done => {
    ResourceType.countDocuments().then(count => {
      request.post(path('/resourcetype'))
        .send({
          name: 'Test ResourceType',
        })
        .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
        .expect('Content-type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          ResourceType.countDocuments()
            .then(newCount => {
              expect(newCount).toBe(count + 1)
            })
            .catch(done)

          const resourcetype = await ResourceType.findOne({ name: 'Test ResourceType' })

          expect(resourcetype.id).toBeTruthy()
          expect(resourcetype.name).toBe('Test ResourceType')

          const { action, entity, data } = res.body

          expect(action).toBe('store')
          expect(entity).toBe('resourceType')

          expect(data.entities[0].name).toBe('Test ResourceType')

          done()
        })
    })
  })
})

describe('GET: /resourcetype/:id', () => {
  let id

  beforeEach(async done => {
    const result = await new ResourceType({ name: 'Test ResourceType' }).save()
    id = `${result._id}`
    done()
  })

  it('A GET to /resourcetype/:id should require authorization', done => {
    request.get(path(`/resourcetype/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('should return the resourcetype with that id', async done => {
    request.get(path(`/resourcetype/${id}`))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('resourceType')

        expect(data.entities[0].id).toBe(id)
        expect(data.entities[0].name).toBe('Test ResourceType')

        done()
      })
  })
})

describe('GET: /resourcetype', () => {
  let resourceTypeOne
  let resourceTypeTwo

  beforeEach(done => {
    resourceTypeOne = new ResourceType({ name: 'Test ResourceType 1' })
    resourceTypeTwo = new ResourceType({ name: 'Test ResourceType 2' })

    Promise.all([resourceTypeOne.save(), resourceTypeTwo.save()]).then(() => done())
  })

  it('A GET to /resourcetype should require authorization', done => {
    request.get(path('/resourcetype'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /resourcetype should return a list of resourcetypes', done => {
    request.get(path('/resourcetype'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('resourceType')
        expect(data.entities.length).toBe(2)

        done()
      })
  })
})

describe('PATCH: /resourcetype/:id', () => {
  let resourceTypeOne
  let resourceTypeTwo

  beforeEach(done => {
    resourceTypeOne = new ResourceType({ name: 'Test ResourceType 1' })
    resourceTypeTwo = new ResourceType({ name: 'Test ResourceType 2' })

    Promise.all([resourceTypeOne.save(), resourceTypeTwo.save()]).then(() => done())
  })

  it('should require authorization', done => {
    request.get(path('/resourcetype'))
      .send({
        name: 'Test ResourceType',
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

  it('A PATCH should update the resourcetype', done => {
    request.patch(path(`/resourcetype/${resourceTypeOne._id}`))
      .send({ name: 'New ResourceType Name' })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const resourceType = await ResourceType.findById(resourceTypeOne._id)

        expect(resourceType.name).toBe('New ResourceType Name')

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('resourceType')

        expect(data.entities[0].name).toBe('New ResourceType Name')

        done()
      })
  })
})
