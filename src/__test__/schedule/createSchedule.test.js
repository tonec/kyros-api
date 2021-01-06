import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import { path } from '../../utils'
import cookie from '../../../test/test-cookie'

const Client = mongoose.model('Client')
const Schedule = mongoose.model('Schedule')

const request = supertest(app)

const clientProps = {
  name: 'Test client',
}

const scheduleProps = {
  name: 'Test schedule',
  description: 'Test schedule description',
}

describe('POST: /schedule', () => {
  let client
  let schedule

  beforeEach(async done => {
    client = await new Client(clientProps)
    schedule = new Schedule(scheduleProps)
    schedule.save().then(() => done())
  })

  it('requires authorization', done => {
    const props = { ...scheduleProps, client: client._id }

    request
      .get(path('/schedule'))
      .send(props)
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('missing name is rejected', async done => {
    request
      .post(path('/schedule'))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        expect(res.status).toBe(400)
        expect(res.body.code).toBe('BadRequest')
        expect(res.body.message).toBe('Validation failed creating schedule')

        done()
      })
  })

  it('creates a new schedule', done => {
    const props = { ...scheduleProps, client: client._id }

    Schedule.countDocuments().then(count => {
      request
        .post(path('/schedule'))
        .send(props)
        .set('Cookie', `accessToken=${cookie}`)
        .expect('Content-type', /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          Schedule.countDocuments()
            .then(newCount => {
              expect(newCount).toBe(count + 1)
            })
            .catch(done)

          const schedule = await Schedule.findOne({ name: 'Test schedule' })

          expect(schedule.id).toBeTruthy()
          expect(schedule.name).toBe('Test schedule')
          expect(schedule.description).toBe('Test schedule description')

          const { action, entity, data } = res.body

          expect(action).toBe('store')
          expect(entity).toBe('schedule')

          expect(data.entities[0].name).toBe('Test schedule')

          done()
        })
    })
  })
})
