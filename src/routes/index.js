import authRoute from './authRoute'
import testRoute from './testRoute'
import userRoute from './userRoute'

export default app => {
  authRoute(app)
  testRoute(app)
  userRoute(app)
}
