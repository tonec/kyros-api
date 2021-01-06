import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const Client = mongoose.model('Client')
const User = mongoose.model('User')

const request = supertest(app)

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

describe('POST: /user', () => {
  let client

  beforeEach(async done => {
    client = await new Client(clientProps)
    done()
  })

  it('missing first name is rejected', async done => {
    const { firstName, ...props } = userProps

    request
      .post(path('/user'))
      .send(props)
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Validation failed creating user')

        done()
      })
  })

  it('missing last name is rejected', async done => {
    const { lastName, ...props } = userProps

    request
      .post(path('/user'))
      .send(props)
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Validation failed creating user')

        done()
      })
  })

  it('missing email is rejected', done => {
    const { email, ...props } = userProps

    request
      .post(path('/user'))
      .send(props)
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Validation failed creating user')

        done()
      })
  })

  it('missing password is rejected', done => {
    const { password, ...props } = userProps

    request
      .post(path('/user'))
      .send(props)
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Validation failed creating user')

        done()
      })
  })

  it('creates a new user', done => {
    const props = { ...userProps, client: client.id }

    User.countDocuments().then(count => {
      request
        .post(path('/user'))
        .send(props)
        .set('Cookie', `accessToken=${cookie}`)
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
          expect(user.address1).toBe('1 Test Street')
          expect(user.city).toBe('Test city')
          expect(user.postcode).toBe('N22BN')
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
