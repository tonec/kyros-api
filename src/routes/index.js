import authRoute from './authRoute'
import clientRoute from './clientRoute'
import serviceRoute from './serviceRoute'
import testRoute from './testRoute'
import userRoute from './userRoute'

export default app => {
  authRoute(app)
  clientRoute(app)
  serviceRoute(app)
  testRoute(app)
  userRoute(app)
}
