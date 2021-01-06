import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import beautifyUnique from 'mongoose-beautiful-unique-validation'
import Joi from '../utils/joi'

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,

    address1: String,
    address2: String,
    city: String,
    postcode: String,

    email: String,
    password: String,

    phone: String,
    dateOfBirth: String,

    super: { type: Boolean, default: false },
    // userGroup: { type: Schema.Types.ObjectId, ref: 'Client' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },

    permissions: String,
  },
  { timestamps: true },
)

UserSchema.methods.joiValidate = obj => {
  return Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),

    address1: Joi.string().required(),
    address2: Joi.string(),
    city: Joi.string().required(),
    postcode: Joi.string().required(),

    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),

    phone: Joi.string(),
    dateOfBirth: Joi.string(),

    super: Joi.boolean(),
    // userGroup: Joi.string().required(),
    client: Joi.string().required(),
    permissions: Joi.string().valid('admin', 'reception', 'host').required(),
  }).validate(obj)
}

UserSchema.plugin(beautifyUnique)

UserSchema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default model('User', UserSchema)
