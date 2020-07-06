import supertest from 'supertest'
import app from '../app'
import { path } from '../utils'
import cookie from '../test/test-cookie'

const request = supertest(app)

describe('ROUTE: /auth/login', () => {
  beforeEach(done => {
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
