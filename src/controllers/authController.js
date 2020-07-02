import { BadRequestError, UnauthorizedError } from 'restify-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import UserModel from '../models/userModel'
import verifyToken from '../utils/verifyToken'

export default {
  // User registration
  register: (req, res, next) => {
    const { body } = req

    const userProps = {
      name: body.name,
      email: body.email,
      password: body.password
      // password: bcrypt.hashSync(body.password, bcrypt.genSaltSync(10))
    }

    if (!body.name || !body.email || !body.password) {
      return res.send(
        new BadRequestError('Incomplete registration information.')
      )
    }

    const User = new UserModel(userProps)

    const validation = User.joiValidate(userProps)

    if (validation.error) {
      res.send(500, validation.error.details)
      return
    }

    User.save()
      .then(user => {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          message: 'New user registered successfully.'
        })
      })
      .catch(err => {
        res.send(500, err.errors)
      })
  },

  // User login
  login: (req, res, next) => {
    UserModel.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res.send(
          new UnauthorizedError({
            message: 'Authentication failed. User not found.'
          })
        )
      }

      if (!user.comparePasswords(req.body.password)) {
        return res.send(
          new UnauthorizedError({
            message: 'Authentication failed. The password entered does not match our records.'
          })
        )
      }

      res.json({
        user: {
          _id: user._id,
          name: user.name
        },
        auth: {
          accessToken: jwt.sign({ name: user.name, email: user.email, _id: user._id }, 'some secret'),
          expires: 1
        }
      })
    })
      .catch(next)
  },

  // Verify token
  verify: (req, res, next) => {
    const { kyros } = req.cookies
    const cookie = kyros ? JSON.parse(kyros) : null

    if (cookie && cookie.accessToken) {
      const verified = verifyToken(cookie.accessToken)

      if (verified) {
        res.send(verified)
        return
      }
    }

    res.send(null)
  },

  // Protected route
  loginRequired: (req, res, next) => {
    console.log('before______________', req.user)
    if (req.user) {
      console.log('inside_____________', req.user)
      return next()
    }

    console.log('after+++++++++++', req.user)

    return res.send(
      new UnauthorizedError({
        message: 'Unauthorised usesssssssssssssr.'
      })
    )
  }
}
