import mongoose from 'mongoose'
import Joi from '@hapi/joi'

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  logo: {
    type: String
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
    name: Joi.string().required(),
    logo: Joi.string(),
    created: Joi.date(),
    modified: Joi.date()
  }).validate(obj)
}

export default mongoose.model('Client', ClientSchema)
