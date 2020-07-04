import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import { path } from '../utils'

const request = supertest(app)

const User = mongoose.model('User')

describe('ROUTE: /auth/register', () => {
  it('A POST with missing first name should be a bad request', async done => {
    request.post(path('/auth/register'))
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
    request.post(path('/auth/register'))
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
    request.post(path('/auth/register'))
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
    request.post(path('/auth/register'))
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

  it('A POST should register a new user and return new name and email but not the password', done => {
    User.countDocuments().then(count => {
      request.post(path('/auth/register'))
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

          expect(user._id).toBeTruthy()
          expect(user.firstName).toBe('Joe')
          expect(user.lastName).toBe('Bloggs')
          expect(user.email).toBe('joe-bloggs@example.com')
          expect(user.password).toBeTruthy()
          expect(user.password).not.toBe('1234567890')

          expect(res.body.firstName).toBe('Joe')
          expect(res.body.lastName).toBe('Bloggs')
          expect(res.body.email).toBe('joe-bloggs@example.com')
          expect(res.body.password).toBe(undefined)

          done()
        })
    })
  })
})

describe('ROUTE: /auth/login', () => {
  beforeEach(done => {
    request.post(path('/auth/register'))
      .send({
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe-bloggs@example.com',
        password: '1234567890'
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A POST should reject a login with an invalid user', done => {
    request.post(path('/auth/login'))
      .send({
        email: 'not-registered@example.com',
        password: '1234567890'
      })
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(401)
        expect(res.body.code).toBe('Unauthorized')
        expect(res.body.message).toBe('User not found')

        done()
      })
  })

  it('A POST should reject a login with an invalid password', done => {
    request.post(path('/auth/login'))
      .send({
        email: 'joe-bloggs@example.com',
        password: 'wrong_password'
      })
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(401)
        expect(res.body.code).toBe('Unauthorized')
        expect(res.body.message).toBe('The password entered does not match our records')

        done()
      })
  })

  it('A POST to /auth/login should return a token for valid users', done => {
    request.post(path('/auth/login'))
      .send({
        email: 'joe-bloggs@example.com',
        password: '1234567890'
      })
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(200)
        expect(res.body.user.firstName).toBe('Joe')
        expect(res.body.user.lastName).toBe('Bloggs')
        expect(res.body.auth.accessToken).toBeTruthy()

        done()
      })
  })
})
