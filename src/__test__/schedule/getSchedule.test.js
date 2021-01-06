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

describe('GET: /schedule/:id', () => {
  let id

  beforeEach(async done => {
    const client = await new Client(clientProps)
    const result = await new Schedule({
      name: 'Test Schedule',
      client: client._id,
    }).save()
    id = `${result._id}`
    done()
  })

  it('requires authorization', done => {
    request
      .get(path(`/schedule/${id}`))
      .expect('Content-type', /json/)
      .expect(401)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('returns the schedule', async done => {
    request
      .get(path(`/schedule/${id}`))
      .set('Cookie', `accessToken=${cookie}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }

        const { action, entity, data } = res.body

        expect(action).toBe('store')
        expect(entity).toBe('schedule')

        expect(data.entities[0].id).toBe(id)
        expect(data.entities[0].name).toBe('Test Schedule')

        done()
      })
  })
})
