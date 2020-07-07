import { BadRequestError } from 'restify-errors'
import { format } from '../utils'
import Booking from '../models/BookingModel'

export default {
  create: async (req, res, next) => {
    const body = req.body || {}
    const booking = new Booking(body)
    const validation = booking.joiValidate(body)

    if (validation.error) {
      next(
        new BadRequestError({
          cause: validation.error,
        }, 'Validation failed creating booking')
      )
      return
    }

    try {
      const data = await booking.save()

      res.json(format({ entity: 'booking', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Validation failed creating booking')
      )
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await Booking.findById(req.params.id)

      res.json(format({ entity: 'booking', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching booking')
      )
    }
  },

  find: async (req, res, next) => {
    try {
      const data = await Booking.find()

      res.json(format({ entity: 'booking', data, req, res }))
    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error fetching booking')
      )
    }
  },

  patch: async (req, res, next) => {
    try {
      await Booking.updateOne({ _id: req.params.id }, req.body)

      const data = await Booking.findById(req.params.id)

      res.json(format({ entity: 'booking', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error updating booking')
      )
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await Booking.findById(req.params.id)

      await Booking.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity: 'booking', data, req, res }))

    } catch (err) {
      next(
        new BadRequestError({
          cause: err,
        }, 'Error removing booking')
      )
    }
  }
}
