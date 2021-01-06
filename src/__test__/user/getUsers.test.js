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

const userOneProps = {
  firstName: 'Joe',
  lastName: 'Bloggs',
  address1: '1 Test Street',
  city: 'Test city',
  postcode: 'N22BN',
  email: 'joe-bloggs@example.com',
  password: 'password',
  permissions: 'admin',
}

const userTwoProps = {
  firstName: 'Jill',
  lastName: 'Bloggs',
  address1: '1 Test Street',
  city: 'Test city',
  postcode: 'N22BN',
  email: 'jill-bloggs@example.com',
  password: 'password',
  permissions: 'host',
}

describe('GET: /user', () => {
  let userOne
  let userTwo

  beforeEach(done => {
    const client = new Client(clientProps)

    userOne = new User({ ...userOneProps, client: client._id })
    userTwo = new User({ ...userTwoProps, client: client._id })

    Promise.all([userOne.save(), userTwo.save()]).then(() => done())
  })

  it('A GET to /user should require authorization', done => {
    request
      .get(path('/user'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /user should return a list of users', done => {
    request
      .get(path('/user'))
      .set('Cookie', `accessToken=${cookie}`)
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
