import mongoose from 'mongoose'
import UserSchema from '../schema/userSchema'

export default mongoose.model('User', UserSchema)
