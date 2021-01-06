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

describe('GET: /user/:id', () => {
  let id

  beforeEach(async done => {
    const client = await new Client(clientProps)
    const result = await new User({
      ...userProps,
      client: client._id,
    }).save()
    id = `${result._id}`
    done()
  })

  it('requires authorization', done => {
    request
      .get(path(`/user/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('returns the user', async done => {
    request
      .get(path(`/user/${id}`))
      .set('Cookie', `accessToken=${cookie}`)
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
