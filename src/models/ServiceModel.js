import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const ServiceSchema = Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String
  },
  client: {
    type: String,
    trim: true,
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

ServiceSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    client: Joi.string().required(),
    created: Joi.date(),
    modified: Joi.date()
  }).validate(obj)
}

export default model('Service', ServiceSchema)
