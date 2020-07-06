import { BadRequestError } from 'restify-errors'
import { format } from '../utils'
import ResourceType from '../models/ResourceTypeModel'

export default {
  create: async (req, res, next) => {
    try {
      const data = await ResourceType.create(req.body)

      res.json(format({ entity: 'resourceType', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Resource type not created')
      )
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await ResourceType.findById(req.params.id)

      res.json(format({ entity: 'resourceType', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching resource type')
      )
    }
  },

  find: async (req, res, next) => {
    try {
      const data = await ResourceType.find()

      res.json(format({ entity: 'resourceType', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching resource type')
      )
    }
  },

  patch: async (req, res, next) => {
    try {
      await ResourceType.updateOne({ _id: req.params.id }, req.body)

      const data = await ResourceType.findById(req.params.id)

      res.json(format({ entity: 'resourceType', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error updating resource type')
      )
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await ResourceType.findById(req.params.id)

      await ResourceType.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity: 'resourceType', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error removing resource type')
      )
    }
  }
}
