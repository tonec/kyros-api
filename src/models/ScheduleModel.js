import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const ScheduleSchema = Schema(
  {
    name: String,
    description: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
  },
  { timestamps: true },
)

ScheduleSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    client: Joi.string().required(),
  }).validate(obj)
}

export default model('Schedule', ScheduleSchema)
