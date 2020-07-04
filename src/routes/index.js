import authRoute from './authRoute'
import resourceRoute from './resourceRoute'
import testRoute from './testRoute'
import userRoute from './userRoute'

export default app => {
  authRoute(app)
  resourceRoute(app)
  testRoute(app)
  userRoute(app)
}
