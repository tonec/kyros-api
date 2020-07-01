import request from 'supertest'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../../config'
import api from '../../'
import cookie from '../test-cookie'

const Trip = mongoose.model('Trip')
const path = config.basePath

const tripOne = {
  title: 'Test Trip',
  description: 'This is my test trip.',
  startDate: '2018-02-01T00:00:00.000Z',
  endDate: '2018-04-10T00:00:00.000Z'
}

describe('ROUTE: POST /trips', () => {
  it('A POST to /trips should require authorization', done => {
    request(api)
      .post(path('/trips'))
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A POST to /trips should be a bad request without title', done => {
    request(api)
      .post(path('/trips'))
      .set('Cookie', `viatorem=${JSON.stringify(cookie)}`)
      .send({
        description: 'This is my test trip.',
        startDate: '2018-02-01T00:00:00.000Z',
        endDate: '2018-04-10T00:00:00.000Z'
      })
      .expect(400)
      .end(done)
  })

  it('A POST to /trips should be a bad request without startDate', done => {
    request(api)
      .post(path('/trips'))
      .set('Cookie', `viatorem=${JSON.stringify(cookie)}`)
      .send({
        title: 'Test Trip',
        description: 'This is my test trip.',
        endDate: '2018-04-10T00:00:00.000Z'
      })
      .expect(400)
      .end(done)
  })

  it('A POST to /trips should be a bad request without endDate', done => {
    request(api)
      .post(path('/trips'))
      .set('Cookie', `viatorem=${JSON.stringify(cookie)}`)
      .send({
        title: 'Test Trip',
        description: 'This is my test trip.',
        startDate: '2018-02-01T00:00:00.000Z'
      })
      .expect(400)
      .end(done)
  })

  it('A POST to /trips should create a new trip and return the created trip', done => {
    Trip.count().then(count => {
      request(api)
        .post(path('/trips'))
        .set('Cookie', `viatorem=${JSON.stringify(cookie)}`)
        .send(tripOne)
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          Trip.count()
            .then(newCount => {
              expect(newCount).to.equal(count + 1)
            })
            .catch(done)

          expect(res.body.title).to.equal(tripOne.title)
          expect(res.body.description).to.equal(tripOne.description)
          expect(res.body.startDate).to.equal(tripOne.startDate)
          done()
        })
    })
  })
})
