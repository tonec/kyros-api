import authRoute from './authRoute'
import clientRoute from './clientRoute'
import resourceRoute from './resourceRoute'
import testRoute from './testRoute'
import userRoute from './userRoute'

export default app => {
  authRoute(app)
  clientRoute(app)
  resourceRoute(app)
  testRoute(app)
  userRoute(app)
}
