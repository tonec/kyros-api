import { Schema, model } from 'mongoose'
import Joi from '@hapi/joi'
import bcrypt from 'bcrypt-nodejs'
import beautifyUnique from 'mongoose-beautiful-unique-validation'

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: 'Two users cannot share the same username ({VALUE})',
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    super: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'reception', 'host'],
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
  },
  { timestamps: true },
)

UserSchema.methods.joiValidate = obj => {
  return Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    super: Joi.boolean(),
    role: Joi.string().required(),
    client: Joi.string().required(),
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
