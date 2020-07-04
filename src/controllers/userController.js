import { BadRequestError } from 'restify-errors'
import bcrypt from 'bcrypt-nodejs'
import UserModel from '../models/UserModel'

export default {
  create: (req, res, next) => {
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

  get: (req, res, next) => {
    const _id = req.params.id

    UserModel.findById({ _id })
      .then(user => {
        res.json(user)
      })
      .catch(next)
  },

  find: (req, res, next) => {
    UserModel.find({})
      .then(users => {
        res.json(users)
      })
      .catch(next)
  },

  patch: () => {},

  update: () => {},

  remove: () => {}
}
