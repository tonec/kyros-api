import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const ClientSchema = Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
  },
  { timestamps: true },
)

ClientSchema.methods.joiValidate = obj => {
  return Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.number(),
  }).validate(obj)
}

export default model('Client', ClientSchema)
