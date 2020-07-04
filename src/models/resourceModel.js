import mongoose from 'mongoose'
import resourceSchema from '../schema/resourceSchema'

export default mongoose.model('Resource', resourceSchema)
