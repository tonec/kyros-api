// import request from 'supertest'
// import { expect } from 'chai'
// import mongoose from 'mongoose'
// import config from '../../../config'
// import api from '../../'
// import cookie from '../test-cookie'

// const User = mongoose.model('User')
// const path = config.basePath

// const userOneProps = {
//   name: 'Joe Bloggs',
//   email: 'joe@example.com',
//   password: '1234'
// }

// const userTwoProps = {
//   name: 'Jill Bloggs',
//   email: 'jill@example.com',
//   password: '1234'
// }

// describe('ROUTE: /users', () => {
//   let userOne
//   let userTwo

//   beforeEach(done => {
//     userOne = new User(userOneProps)
//     userTwo = new User(userTwoProps)

//     Promise.all([userOne.save(), userTwo.save()]).then(() => done())
//   })

//   it('A GET to /users should require authorization', done => {
//     request(api)
//       .get(path('/users'))
//       .expect(401)
//       .end(err => {
//         if (err) {
//           return done(new Error(`Supertest has encountered an error: ${err}`))
//         }
//         done()
//       })
//   })

//   it('A GET to /users should return a list of users', done => {
//     request(api)
//       .get(path('/users'))
//       .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           return done(new Error(`Supertest has encountered an error: ${err}`))
//         }
//         expect(res.body.length).to.equal(2)
//         expect(
//           res.body.filter(user => user.name === 'Joe Bloggs').length
//         ).to.equal(1)
//         expect(
//           res.body.filter(user => user.name === 'Jill Bloggs').length
//         ).to.equal(1)
//         done()
//       })
//   })

//   it('A GET to /users/:id should require authorization', done => {
//     request(api)
//       .get(path(`/users/${userOne._id}`))
//       .expect(401)
//       .end(err => {
//         if (err) {
//           return done(new Error(`Supertest has encountered an error: ${err}`))
//         }
//         done()
//       })
//   })

//   it('A GET to /users/:id should return a specific user', done => {
//     request(api)
//       .get(path(`/users/${userOne._id}`))
//       .set('Cookie', `kyros=${JSON.stringify(cookie)}`)
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           return done(new Error(`Supertest has encountered an error: ${err}`))
//         }
//         expect(res.body.name).to.equal(userOne.name)
//         expect(res.body.email).to.equal(userOne.email)
//         expect(res.body.password).to.equal(undefined)
//         done()
//       })
//   })
// })
