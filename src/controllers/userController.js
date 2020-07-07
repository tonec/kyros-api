import { BadRequestError } from 'restify-errors'
import bcrypt from 'bcrypt-nodejs'
import { format } from '../utils'
import User from '../models/UserModel'

export default {
  create: async (req, res, next) => {
    const body = req.body || {}
    const user = new User(body)
    const validation = user.joiValidate(body)

    if (validation.error) {
      next(
        new BadRequestError({
          cause: validation.error,
        }, 'Validation failed creating user')
      )
      return
    }

    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

    try {
      const data = await user.save()

      res.json(format({ entity: 'user', omit: ['password'], data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'User not created')
      )
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await User.findById(req.params.id)

      res.json(format({ entity: 'user', data, req, res }))
    } catch (err) {
      next(err)
    }
  },

  find: async (req, res, next) => {
    try {
      const data = await User.find()

      res.json(format({ entity: 'user', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching users')
      )
    }
  },

  patch: async (req, res, next) => {
    try {
      await User.updateOne({ _id: req.params.id }, req.body)

      const data = await User.findById(req.params.id)

      res.json(format({ entity: 'user', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error updating user')
      )
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await User.findById(req.params.id)

      await User.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity: 'user', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error removing user')
      )
    }
  }
}
