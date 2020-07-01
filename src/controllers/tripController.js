import errors from 'restify-errors'
import format from '../utils/format'
import Trip from '../models/tripModel'

export default {
  query: (req, res) => {
    console.log('user ________________________-', req.user)
    Trip.find({ user: req.user._id })
      .then(trips => {
        res.json(format('trips', trips, req, res))
      })
      .catch(err => {
        res.send(
          new errors.BadRequestError({
            message: err.message
          })
        )
      })
  },

  detail: (req, res, next) => {
    Trip.findById(req.params.id)
      .then(trip => {
        if (trip.user.toString() !== req.user._id) {
          res.json(
            new errors.UnauthorizedError({
              message:
                'Request failed. You do not have permission to access this resource.'
            })
          )
        }
        res.json({
          id: trip._id,
          title: trip.title,
          description: trip.description,
          startDate: trip.startDate,
          endDate: trip.endDate,
          user: trip.user._id
        })
      })
      .catch(next)
  },

  insert: (req, res) => {
    Trip.create({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      user: req.user._id
    })
      .then(trip => {
        res.json(trip)
      })
      .catch(err => {
        res.send(
          new errors.BadRequestError({
            message: err.message
          })
        )
      })
  },

  update: (req, res) => {
    // TODO: implement this
  },

  delete: (req, res) => {
    // TODO: implement this
  }
}
