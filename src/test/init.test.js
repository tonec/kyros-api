import supertest from 'supertest'
import app from '../app'

const request = supertest(app)

it('Gets the test endpoint', async done => {
  // Sends GET Request to /test endpoint
  const res = await request.get('/api/test')

  expect(res.status).toBe(200)
  expect(res.body.message).toBe('pass!')

  done()
})
