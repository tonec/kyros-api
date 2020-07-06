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
  it('A POST with missing first name should be a bad request', async done => {
    request.post(path('/user'))
      .send({
        lastName: 'Bloggs',
        email: 'joe-bloggs@example.com',
        password: '1234567890'
      })
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

  it('A POST should create a new user and return new name and email but not the password', done => {
    User.countDocuments().then(count => {
      request.post(path('/user'))
        .send({
          firstName: 'Joe',
          lastName: 'Bloggs',
          email: 'joe-bloggs@example.com',
          password: '1234567890'
        })
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

          const { data: { entities } } = res.body

          expect(user.id).toBeTruthy()
          expect(user.firstName).toBe('Joe')
          expect(user.lastName).toBe('Bloggs')
          expect(user.email).toBe('joe-bloggs@example.com')
          expect(user.password).toBeTruthy()
          expect(user.password).not.toBe('1234567890')

          expect(entities[0].firstName).toBe('Joe')
          expect(entities[0].lastName).toBe('Bloggs')
          expect(entities[0].email).toBe('joe-bloggs@example.com')
          expect(entities[0].password).toBe(undefined)

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
      .expect('Content-type', /json/)
      .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { data: { entities } } = res.body

        expect(res.status).toBe(200)
        expect(entities[0].id).toBe(id)
        expect(entities[0].firstName).toBe('Joe')
        expect(entities[0].lastName).toBe('Bloggs')
        expect(entities[0].email).toBe('joe-bloggs@example.com')

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

//   it('A GET to /user should return a list of users', done => {
//     request.get(path('/user'))
//       .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           return done(new Error(`Supertest has encountered an error: ${err}`))
//         }
//         expect(res.body.length).toBe(2)
//         expect(
//           res.body.filter(user => user.name === 'Joe Bloggs').length
//         ).to.equal(1)
//         expect(
//           res.body.filter(user => user.name === 'Jill Bloggs').length
//         ).to.equal(1)
//         done()
//       })
//   })
})

//   it('A GET to /users/:id should require authorization', done => {
//     request(api)
//       .get(path(`/users/${userOne._id}`))
//       .expect(401)
//       .end(err => {
//         if (err) {
//           return done(new Error(`Supertest has encountered an error: ${err}`))
//         }
//         done()
//       })
//   })

//   it('A GET to /users/:id should return a specific user', done => {
//     request(api)
//       .get(path(`/users/${userOne._id}`))
//       .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           return done(new Error(`Supertest has encountered an error: ${err}`))
//         }
//         expect(res.body.name).to.equal(userOne.name)
//         expect(res.body.email).to.equal(userOne.email)
//         expect(res.body.password).to.equal(undefined)
//         done()
//       })
//   })
// })
