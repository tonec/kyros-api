import { BadRequestError } from 'restify-errors'
import { format } from '../utils'
import Service from '../models/ServiceModel'

export default {
  create: async (req, res, next) => {
    const body = req.body || {}
    const service = new Service(body)
    const validation = service.joiValidate(body)

    if (validation.error) {
      next(
        new BadRequestError({
          cause: validation.error,
        }, 'Validation failed creating service')
      )
      return
    }

    try {
      const data = await service.save()

      res.json(format({ entity: 'service', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Service not created')
      )
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await Service.findById(req.params.id)

      res.json(format({ entity: 'service', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching service')
      )
    }
  },

  find: async (req, res, next) => {
    try {
      const data = await Service.find()

      res.json(format({ entity: 'service', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching service')
      )
    }
  },

  patch: async (req, res, next) => {
    try {
      await Service.updateOne({ _id: req.params.id }, req.body)

      const data = await Service.findById(req.params.id)

      res.json(format({ entity: 'service', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error updating service')
      )
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await Service.findById(req.params.id)

      await Service.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity: 'service', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error removing service')
      )
    }
  }
}
