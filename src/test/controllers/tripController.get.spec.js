import request from 'supertest'
import { expect } from 'chai'
import config from '../../../config'
import api from '../../'
import { registerAndLoginUser, createTrip } from '../test-helpers'

const path = config.basePath

const userOneProps = {
  name: 'Joe Bloggs',
  email: 'joe-bloggs@example.com',
  password: '1234'
}

const userTwoProps = {
  name: 'Jill Bloggs',
  email: 'jill-bloggs@example.com',
  password: '5678'
}

const tripOneProps = {
  title: 'Test Trip',
  description: 'This is my test trip.',
  startDate: '2018-03-12T00:00:00.000Z',
  endDate: '2018-04-11T00:00:00.000Z'
}

const tripTwoProps = {
  title: 'Test Trip Two',
  description: 'This is my second test trip.',
  startDate: '2018-09-03T00:00:00.000Z',
  endDate: '2018-09-10T00:00:00.000Z'
}

describe('ROUTE: GET /trips', () => {
  let auth
  let tripOne
  let tripTwo

  beforeEach(done => {
    Promise.all([
      registerAndLoginUser(api)(userOneProps, done),
      registerAndLoginUser(api)(userTwoProps, done)
    ])
      .then(userRegResults => {
        auth = userRegResults

        // User One Trips
        tripOne = createTrip(api)(auth[0].login.auth, tripOneProps)
        tripTwo = createTrip(api)(auth[0].login.auth, tripTwoProps)

        return Promise.all([tripOne, tripTwo])
          .then(() => {
            done()
          })
          .catch(err => {
            console.log('Error: ', err)
            done(
              new Error(
                'Supertest has encountered an error creating test trips'
              )
            )
          })
      })
      .catch(err => {
        console.log('Error registering test users: ', err)
        done()
      })
  })

  it('A GET to /trips should require authorization', done => {
    request(api)
      .get(path('/trips'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A GET to /trips should return a list of all trips for the specific user', done => {
    request(api)
      .get(path('/trips'))
      .set('Cookie', `viatorem=${JSON.stringify(auth[0].login.auth)}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        expect(res.body['trips'].length).to.equal(2)
        done()
      })
  })

  it('A GET to /trips/:id should be rejected if the user does not own that trip', done => {
    tripOne
      .then(res => {
        const tripOneId = res.body._id

        request(api)
          .get(path(`/trips/${tripOneId}`))
          .set('Cookie', `viatorem=${JSON.stringify(auth[1].login.auth)}`)
          .expect('Content-Type', /json/)
          .expect(401)
          .end(err => {
            if (err) {
              return done(
                new Error(`Supertest has encountered an error: ${err}`)
              )
            }
            done()
          })
      })
      .catch(console.log)
  })

  it('A GET to /trips/:id should return a specific trip', done => {
    tripOne.then(res => {
      const tripOneId = res.body._id

      request(api)
        .get(path(`/trips/${tripOneId}`))
        .set('Cookie', `viatorem=${JSON.stringify(auth[0].login.auth)}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(err => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }
          expect(res.body.title).to.equal(tripOneProps.title)
          done()
        })
    })
  })
})
