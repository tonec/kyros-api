import authRoute from './authRoute'
import userRoute from './userRoute'
import tripRoute from './tripRoute'

export default app => {
  authRoute(app)
  userRoute(app)
  tripRoute(app)
}
