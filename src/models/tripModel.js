import mongoose from 'mongoose'
import tripSchema from '../schema/tripSchema'

export default mongoose.model('Trip', tripSchema)
