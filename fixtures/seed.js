import mongoose from 'mongoose'
import client from './client'
import resource from './resource'
import resourceType from './resourceType'
import user from './user'

require('dotenv').config()

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000
}

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

mongoose.connect(url, options)
  .then(async () => {
    console.log('MongoDB is connected')

    await client()
    await resourceType()
    await resource()
    await user()

    console.log('done!')
  })
  .catch((err) => {
    console.log(err)
  })

mongoose.set('useCreateIndex', true)
