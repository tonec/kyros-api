import errors from 'restify-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import User from '../models/userModel'
import verifyToken from '../utils/verifyToken'

export default {
  // User registration
  register: (req, res) => {
    const { body } = req

    const userProps = {
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, bcrypt.genSaltSync(10))
    }

    if (!body.name || !body.email || !body.password) {
      return res.send(
        new errors.BadRequestError('Incomplete registration information.')
      )
    }

    User.create(userProps)
      .then(user => {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          message: 'New user registered successfully.'
        })
      })
      .catch(err => {
        res.send(
          new errors.BadRequestError({
            message: err.message
          })
        )
      })
  },

  // User login
  login: (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res.send(
          new errors.UnauthorizedError({
            message: 'Authentication failed. User not found.'
          })
        )
      }

      if (!user.comparePasswords(req.body.password)) {
        return res.send(
          new errors.UnauthorizedError({
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
    const { viatorem } = req.cookies
    const cookie = viatorem ? JSON.parse(viatorem) : null

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
      new errors.UnauthorizedError({
        message: 'Unauthorised usesssssssssssssr.'
      })
    )
  }
}
