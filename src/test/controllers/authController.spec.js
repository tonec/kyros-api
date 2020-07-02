import request from 'supertest'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../../config'
import api from '../../'

const User = mongoose.model('User')
const path = config.basePath

const userOneProps = {
  name: 'Joe Bloggs',
  email: 'joe-bloggs@example.com',
  password: '1234'
}

describe('ROUTE: /auth/register', () => {
  it('A POST to /auth/register should be a bad request without name', done => {
    request(api)
      .post(path('/auth/register'))
      .send({
        email: 'joe-bloggs@example.com',
        password: '1234'
      })
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        expect(res.status).to.equal(400)
        expect(res.body.code).to.equal('BadRequest')
        expect(res.body.message).to.equal(
          'Incomplete registration information.'
        )
        done()
      })
  })

  it('A POST to /auth/register should be a bad request without email', done => {
    request(api)
      .post(path('/auth/register'))
      .send({
        name: 'Joe Bloggs',
        password: '1234'
      })
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        expect(res.status).to.equal(400)
        expect(res.body.code).to.equal('BadRequest')
        expect(res.body.message).to.equal(
          'Incomplete registration information.'
        )
        done()
      })
  })

  it('A POST to /auth/register should be a bad request without password', done => {
    request(api)
      .post(path('/auth/register'))
      .send({
        name: 'Joe Bloggs',
        email: 'joe-bloggs@example.com'
      })
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        expect(res.status).to.equal(400)
        expect(res.body.code).to.equal('BadRequest')
        expect(res.body.message).to.equal(
          'Incomplete registration information.'
        )
        done()
      })
  })

  it('A POST to /auth/register should register a new user and return new name and email but not the password', done => {
    User.countDocuments().then(count => {
      request(api)
        .post(path('/auth/register'))
        .send(userOneProps)
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(new Error(`Supertest has encountered an error: ${err}`))
          }

          User.countDocuments()
            .then(newCount => {
              expect(newCount).to.equal(count + 1)
            })
            .catch(done)

          expect(res.body.name).to.equal(userOneProps.name)
          expect(res.body.email).to.equal(userOneProps.email)
          expect(res.body.password).to.equal(undefined)
          done()
        })
    })
  })
})

describe('ROUTE: /auth/login', () => {
  beforeEach(done => {
    request(api)
      .post(path('/auth/register'))
      .send(userOneProps)
      .expect('Content-type', /json/)
      .expect(200)
      .end(err => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        done()
      })
  })

  it('A POST to /auth/login should reject invalid users', done => {
    request(api)
      .post(path('/auth/login'))
      .send({
        email: 'not-registered@example.com',
        password: '1234'
      })
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        expect(res.status).to.equal(401)
        expect(res.body.code).to.equal('Unauthorized')
        expect(res.body.message).to.equal(
          'Authentication failed. User not found.'
        )
        done()
      })
  })

  it('A POST to /auth/login should return a token for valid users', done => {
    request(api)
      .post(path('/auth/login'))
      .send({
        email: userOneProps.email,
        password: userOneProps.password
      })
      .end((err, res) => {
        if (err) {
          return done(new Error(`Supertest has encountered an error: ${err}`))
        }
        expect(res.status).to.equal(200)
        expect(res.body.user.name).to.equal(userOneProps.name)
        expect(res.body.auth.accessToken).to.not.equal(undefined)
        done()
      })
  })
})
