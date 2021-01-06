import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const request = supertest(app)

const Client = mongoose.model('Client')

const clientProps = {
  name: 'Test client',
}

const userProps = {
  firstName: 'Joe',
  lastName: 'Bloggs',
  address1: '1 Test Street',
  city: 'Test city',
  postcode: 'N22BN',
  email: 'joe-bloggs@example.com',
  password: 'password',
  permissions: 'admin',
}

describe('ROUTE: /auth/login', () => {
  beforeEach(async done => {
    const client = await new Client(clientProps)
    const props = { ...userProps, client: client._id }

    request
      .post(path('/user'))
      .send(props)
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('rejected if invalid email', done => {
    request
      .post(path('/auth/login'))
      .send({
        email: 'not-registered@example.com',
        password: 'password',
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

  it('rejected if invalid password', done => {
    request
      .post(path('/auth/login'))
      .send({
        email: 'joe-bloggs@example.com',
        password: 'wrong_password',
      })
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(401)
        expect(res.body.code).toBe('Unauthorized')
        expect(res.body.message).toBe(
          'The password entered does not match our records',
        )

        done()
      })
  })

  it('returns a token for valid login', done => {
    request
      .post(path('/auth/login'))
      .send({
        email: 'joe-bloggs@example.com',
        password: 'password',
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
