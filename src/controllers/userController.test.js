import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import { path } from '../utils'
import cookie from '../test/test-cookie'

const request = supertest(app)

const userOneProps = {
  firstName: 'Joe',
  lastName: 'Bloggs',
  email: 'joe-bloggs@example.com',
  password: '1234567890'
}

const userTwoProps = {
  firstName: 'Jill',
  lastName: 'Bloggs',
  email: 'jill-bloggs@example.com',
  password: '1234567890'
}

const User = mongoose.model('User')

describe('POST: /user', () => {
  it('should require authorization', done => {
    request.get(path('/user'))
      .send({
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe-bloggs@example.com',
        password: '1234567890'
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

  it('A POST with missing first name should be a bad request', async done => {
    request.post(path('/user'))
      .send({
        lastName: 'Bloggs',
        email: 'joe-bloggs@example.com',
        password: '1234567890'
      })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('User not registered')

        done()
      })
  })

  it('A POST with missing last name should be a bad request', async done => {
    request.post(path('/user'))
      .send({
        firstName: 'Joe',
        email: 'joe-bloggs@example.com',
        password: '1234567890'
      })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('User not registered')

        done()
      })
  })

  it('A POST with missing email should be a bad request', done => {
    request.post(path('/user'))
      .send({
        firstName: 'Joe',
        lastName: 'Bloggs',
        password: '1234'
      })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('User not registered')

        done()
      })
  })

  it('A POST with missing password should be a bad request', done => {
    request.post(path('/user'))
      .send({
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe-bloggs@example.com'
      })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('User not registered')

        done()
      })
  })

  it('A POST should create a new user', done => {
    User.countDocuments().then(count => {
      request.post(path('/user'))
        .send({
          firstName: 'Joe',
          lastName: 'Bloggs',
          email: 'joe-bloggs@example.com',
          password: '1234567890'
        })
        .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
        .expect('Content-type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          User.countDocuments()
            .then(newCount => {
              expect(newCount).toBe(count + 1)
            })
            .catch(done)

          const user = await User.findOne({ email: 'joe-bloggs@example.com' })

          expect(user.id).toBeTruthy()
          expect(user.firstName).toBe('Joe')
          expect(user.lastName).toBe('Bloggs')
          expect(user.email).toBe('joe-bloggs@example.com')
          expect(user.password).toBeTruthy()
          expect(user.password).not.toBe('1234567890')

          const { action, entity, data } = res.body

          expect(action).toBe('store')
          expect(entity).toBe('user')

          expect(data.entities[0].firstName).toBe('Joe')
          expect(data.entities[0].lastName).toBe('Bloggs')
          expect(data.entities[0].email).toBe('joe-bloggs@example.com')
          expect(data.entities[0].password).toBe(undefined)

          done()
        })
    })
  })
})

describe('GET: /user/:id', () => {
  let id

  beforeEach(async done => {
    const result = await new User(userOneProps).save()
    id = `${result._id}`
    done()
  })

  it('A GET to /user/:id should require authorization', done => {
    request.get(path(`/user/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('should return the user with that id', async done => {
    request.get(path(`/user/${id}`))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('user')

        expect(data.entities[0].id).toBe(id)
        expect(data.entities[0].firstName).toBe('Joe')
        expect(data.entities[0].lastName).toBe('Bloggs')
        expect(data.entities[0].email).toBe('joe-bloggs@example.com')

        done()
      })
  })
})

describe('GET: /user', () => {
  let userOne
  let userTwo

  beforeEach(done => {
    userOne = new User(userOneProps)
    userTwo = new User(userTwoProps)

    Promise.all([userOne.save(), userTwo.save()]).then(() => done())
  })

  it('A GET to /user should require authorization', done => {
    request.get(path('/user'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /user should return a list of users', done => {
    request.get(path('/user'))
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('user')
        expect(data.entities.length).toBe(2)

        done()
      })
  })
})

describe('PATCH: /user/:id', () => {
  let userOne
  let userTwo

  beforeEach(done => {
    userOne = new User(userOneProps)
    userTwo = new User(userTwoProps)

    Promise.all([userOne.save(), userTwo.save()]).then(() => done())
  })

  it('should require authorization', done => {
    request.get(path('/user'))
      .send(userOneProps)
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A PATCH should update the user', done => {
    request.patch(path(`/user/${userOne._id}`))
      .send({
        firstName: 'Fred',
        lastName: 'Smith'
      })
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const user = await User.findById(userOne._id)

        expect(user.firstName).toBe('Fred')
        expect(user.lastName).toBe('Smith')

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('user')

        expect(data.entities[0].firstName).toBe('Fred')
        expect(data.entities[0].lastName).toBe('Smith')

        done()
      })
  })
})
