import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const BookingSchema = Schema({
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

  }
}, { timestamps: true })

BookingSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    logo: Joi.string()
  }).validate(obj)
}

export default model('Booking', BookingSchema)
