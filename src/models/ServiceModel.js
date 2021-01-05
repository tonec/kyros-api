import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const ServiceSchema = Schema(
  {
    name: String,
    description: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
  },
  { timestamps: true },
)

ServiceSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    client: Joi.string().required(),
  }).validate(obj)
}

export default model('Service', ServiceSchema)
