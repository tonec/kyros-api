import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const BreakSchema = new Schema({ start: 'string', end: 'string' })

const ShiftSchema = Schema(
  {
    start: String,
    end: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userGroup: { type: Schema.Types.ObjectId, ref: 'userGroup' },
    breaks: [BreakSchema],
  },
  { timestamps: true },
)

ShiftSchema.methods.joiValidate = obj => {
  return Joi.object({
    start: Joi.string()
      .regex(/^([0-9]{2}):([0-9]{2})$/)
      .required(),
    end: Joi.string()
      .regex(/^([0-9]{2}):([0-9]{2})$/)
      .required(),
    user: Joi.string().required,
    userGroup: Joi.array().items(
      Joi.object({
        start: Joi.string().required(),
        end: Joi.string().required(),
      }),
    ),
  }).validate(obj)
}

export default model('Shift', ShiftSchema)
