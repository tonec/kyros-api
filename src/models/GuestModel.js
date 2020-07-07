import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const ClientSchema = Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: Number,
    trim: true
  }
}, { timestamps: true })

ClientSchema.methods.joiValidate = obj => {
  return Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.number()
  }).validate(obj)
}

export default model('Client', ClientSchema)
