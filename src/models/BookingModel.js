import mongoose from 'mongoose'
import Joi from '@hapi/joi'

const BookingSchema = mongoose.Schema({
  client: {
    type: String,
    required: true
  },
  host: {

  },
  resource: {

  },
  resourceType: {

  },
  bookedBy: {

  },
  startsAt: {

  },
  endsAt: {

  },
  duration: {

  },
  cancelled: {

  },
  cancelledBy: {

  },
  notes: {

  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
})

BookingSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    logo: Joi.string(),
    created: Joi.date(),
    modified: Joi.date()
  }).validate(obj)
}

export default mongoose.model('Booking', BookingSchema)
