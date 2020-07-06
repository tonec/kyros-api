import mongoose from 'mongoose'
import Joi from '@hapi/joi'

const ResourceSchema = mongoose.Schema({
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
  resourceType: {
    type: String,
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

ResourceSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    client: Joi.string().required(),
    resourceType: Joi.string().required(),
    created: Joi.date(),
    modified: Joi.date()
  }).validate(obj)
}

export default mongoose.model('Resource', ResourceSchema)
