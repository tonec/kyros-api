import { BadRequestError } from 'restify-errors'
import { format } from '../utils'
import Client from '../models/ClientModel'

export default {
  create: async (req, res, next) => {
    const body = req.body || {}
    const client = new Client(body)
    const validation = client.joiValidate(body)

    if (validation.error) {
      next(
        new BadRequestError({
          cause: validation.error,
        }, 'Validation failed creating client')
      )
      return
    }

    try {
      const data = await client.save()

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
      const data = await Client.findById(req.params.id)

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
      const data = await Client.find()

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
      await Client.updateOne({ _id: req.params.id }, req.body)

      const data = await Client.findById(req.params.id)

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
      const data = await Client.findById(req.params.id)

      await Client.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity: 'client', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error removing client')
      )
    }
  }
}
