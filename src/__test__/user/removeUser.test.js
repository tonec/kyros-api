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

describe('DELETE: /user/:id', () => {
  let userOne
  let userTwo

  beforeEach(done => {
    const client = new Client(clientProps)

    userOne = new User({ ...userOneProps, client: client._id })
    userTwo = new User({ ...userTwoProps, client: client._id })

    Promise.all([userOne.save(), userTwo.save()]).then(() => done())
  })

  it('requires authorization', done => {
    request
      .delete(path(`/user/${userOne._id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('removes the user', async done => {
    const user = await User.findById(userOne._id)

    expect(user.firstName).toBe('Joe')
    expect(user.lastName).toBe('Bloggs')

    request
      .delete(path(`/user/${userOne._id}`))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const user = await User.findById(userOne._id)

        expect(user).toBeNull()

        done()
      })
  })
})
