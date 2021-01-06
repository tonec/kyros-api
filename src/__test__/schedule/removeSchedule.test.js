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

describe('DELETE: /schedule/:id', () => {
  let scheduleOne
  let scheduleTwo

  beforeEach(async done => {
    const client = await new Client(clientProps)
    scheduleOne = new Schedule({ name: 'Test Schedule 1', client: client._id })
    scheduleTwo = new Schedule({ name: 'Test Schedule 2', client: client._id })

    Promise.all([scheduleOne.save(), scheduleTwo.save()]).then(() => done())
  })

  it('requires authorization', done => {
    request
      .delete(path(`/schedule/${scheduleOne._id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('removes the schedule', async done => {
    const schedule = await Schedule.findById(scheduleOne._id)
    expect(schedule.name).toBe('Test Schedule 1')

    request
      .delete(path(`/schedule/${scheduleOne._id}`))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const schedule = await Schedule.findById(scheduleOne._id)

        expect(schedule).toBeNull()

        done()
      })
  })
})
