import { format } from '../utils'
import {
  createError,
  validationError,
  fetchError,
  updateError,
  removeError,
} from '../utils/requestError'
import Schedule from '../models/ScheduleModel'

const entity = 'schedule'

export default {
  create: async (req, res, next) => {
    const body = req.body || {}
    const schedule = new Schedule(body)
    const validation = schedule.joiValidate(body)

    if (validation.error) {
      next(validationError(entity, validation.error))
      return
    }

    try {
      const data = await schedule.save()

      res.json(format({ entity, data, req, res }))
    } catch (error) {
      next(createError(entity, error))
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await Schedule.findById(req.params.id)

      res.json(format({ entity, data, req, res }))
    } catch (error) {
      next(fetchError(entity, error))
    }
  },

  find: async (req, res, next) => {
    try {
      const data = await Schedule.find()

      res.json(format({ entity, data, req, res }))
    } catch (error) {
      next(next(fetchError(entity, error)))
    }
  },

  patch: async (req, res, next) => {
    try {
      await Schedule.updateOne({ _id: req.params.id }, req.body)

      const data = await Schedule.findById(req.params.id)

      res.json(format({ entity, data, req, res }))
    } catch (error) {
      next(updateError(entity, error))
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await Schedule.findById(req.params.id)

      await Schedule.remove({ _id: req.params.id })

      res.json(format({ action: 'remove', entity, data, req, res }))
    } catch (error) {
      next(removeError(entity, error))
    }
  },
}
