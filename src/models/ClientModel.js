import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'

const ClientSchema = Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  logo: {
    type: String
  }
}, { timestamps: true })

ClientSchema.methods.joiValidate = obj => {
  return Joi.object({
    name: Joi.string().required(),
    logo: Joi.string()
  }).validate(obj)
}

ClientSchema.statics.random = async function (cb) {
  const count = await this.countDocuments()
  const rand = Math.floor(Math.random() * count)

  return this.findOne().skip(rand)
}

export default model('Client', ClientSchema)
