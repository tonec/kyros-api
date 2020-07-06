import { BadRequestError, UnauthorizedError } from 'restify-errors'
import { format } from '../utils'
import ClientModel from '../models/ClientModel'

export default {
  create: async (req, res, next) => {
    try {
      const data = await ClientModel.create({
        name: req.body.name,
      })

      res.json(format({ entity: 'client', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Client not created')
      )
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await ClientModel.findById(req.params.id)

      res.json(format({ entity: 'client', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching client')
      )
    }
  },

  find: async (req, res, next) => {
    try {
      const data = await ClientModel.find()

      res.json(format({ entity: 'client', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching clients')
      )
    }
  },

  patch: async (req, res, next) => {
    try {
      await ClientModel.updateOne({ _id: req.params.id }, req.body)

      const data = await ClientModel.findById(req.params.id)

      res.json(format({ entity: 'client', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error updating client')
      )
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await ClientModel.findById(req.params.id)

      await ClientModel.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity: 'client', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error updating client')
      )
    }
  },
}
