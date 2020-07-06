import { BadRequestError } from 'restify-errors'
import { format } from '../utils'
import Resource from '../models/ResourceModel'

export default {
  create: async (req, res, next) => {
    try {
      const data = await Resource.create(req.body)

      res.json(format({ entity: 'resource', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Resource not created')
      )
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await Resource.findById(req.params.id)

      res.json(format({ entity: 'resource', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching resource')
      )
    }
  },

  find: async (req, res, next) => {
    try {
      const data = await Resource.find()

      res.json(format({ entity: 'resource', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching resource')
      )
    }
  },

  patch: async (req, res, next) => {
    try {
      await Resource.updateOne({ _id: req.params.id }, req.body)

      const data = await Resource.findById(req.params.id)

      res.json(format({ entity: 'resource', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error updating resource')
      )
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await Resource.findById(req.params.id)

      await Resource.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity: 'resource', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error removing resource')
      )
    }
  }
}
