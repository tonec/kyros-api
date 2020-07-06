import mongoose from 'mongoose'
import Joi from '@hapi/joi'

const ClientSchema = mongoose.Schema({
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

ClientSchema.methods.joiValidate = obj => {
  return Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.number(),
    created: Joi.date(),
    modified: Joi.date()
  }).validate(obj)
}

export default mongoose.model('Client', ClientSchema)
