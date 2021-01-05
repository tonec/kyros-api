import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const UserGroupSchema = Schema(
  {
    name: String,
    defaultRate: Number,
  },
  { timestamps: true },
)

UserGroupSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    defaultRate: Joi.number().required(),
  }).validate(obj)
}

export default model('UserGroup', UserGroupSchema)
