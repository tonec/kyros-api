import { UnauthorizedError, BadRequestError } from 'restify-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import UserModel from '../models/userModel'
import verifyToken from '../utils/verifyToken'

export default {
  register: (req, res, next) => {
    const { body } = req

    const userProps = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password
    }

    const User = new UserModel(userProps)

    const validation = User.joiValidate(userProps)

    if (validation.error) {
      next(
        new BadRequestError({
          cause: validation.error,
        }, 'User not registered')
      )
      return
    }

    User.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10))

    User.save()
      .then(user => {
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          message: 'New user registered successfully'
        })
      })
      .catch(error => {
        next(
          new BadRequestError({
            cause: error,
          }, 'User not registered')
        )
      })
  },

  login: (req, res, next) => {
    UserModel.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return next(
          new UnauthorizedError('User not found')
        )
      }

      if (!user.comparePasswords(req.body.password)) {
        return next(
          new UnauthorizedError('The password entered does not match our records')
        )
      }

      res.json({
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName
        },
        auth: {
          accessToken: jwt.sign({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }, process.env.JWT_SECTRET),
          expires: 1
        }
      })
    })
      .catch(next)
  },

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
    // console.log('before______________', req.user)
    if (req.user) {
      // console.log('inside_____________', req.user)
      return next()
    }

    // console.log('after+++++++++++', req.user)

    return next(
      new UnauthorizedError('Unauthorised usesssssssssssssr.')
    )
  }
}
