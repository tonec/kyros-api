import authRoute from './authRoute'
import bookingRoute from './bookingRoute'
import clientRoute from './clientRoute'
import scheduleRoute from './scheduleRoute'
import serviceRoute from './serviceRoute'
import testRoute from './testRoute'
import userRoute from './userRoute'

export default app => {
  authRoute(app)
  bookingRoute(app)
  clientRoute(app)
  scheduleRoute(app)
  serviceRoute(app)
  testRoute(app)
  userRoute(app)
}
