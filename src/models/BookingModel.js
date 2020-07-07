import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const BookingSchema = Schema({
  startsAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  host: {
    type: Schema.Types.objectId,
    ref: 'User',
    required: true
  },
  service: {
    type: Schema.Types.objectId,
    ref: 'Service',
    required: true
  },
  client: {
    type: Schema.Types.objectId,
    ref: 'Client',
    required: true
  }
}, { timestamps: true })

BookingSchema.methods.joiValidate = obj => {
  return Joi.object({
    startsAt: Joi.date().required(),
    duration: Joi.number().required(),
    notes: Joi.string(),
    host: Joi.string().required(),
    service: Joi.string().required(),
    client: Joi.string().required()
  }).validate(obj)
}

export default model('Booking', BookingSchema)
