import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const BookingSchema = Schema(
  {
    startsAt: Date,
    duration: Number,
    notes: String,

    host: { type: Schema.Types.ObjectId, ref: 'User' },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
  },
  { timestamps: true },
)

BookingSchema.methods.joiValidate = obj => {
  return Joi.object({
    startsAt: Joi.date().required(),
    duration: Joi.number().required(),
    notes: Joi.string(),

    host: Joi.string().required(),
    service: Joi.string().required(),
    client: Joi.string().required(),
  }).validate(obj)
}

export default model('Booking', BookingSchema)
