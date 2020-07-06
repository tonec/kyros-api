import mongoose from 'mongoose'
import Joi from '@hapi/joi'

const ResourceTypeSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
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

ResourceTypeSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    created: Joi.date(),
    modified: Joi.date()
  }).validate(obj)
}

export default mongoose.model('ResourceType', ResourceTypeSchema)
