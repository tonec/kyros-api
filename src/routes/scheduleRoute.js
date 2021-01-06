import { path, isAuthorized } from '../utils'
import scheduleController from '../controllers/scheduleController'

export default app => {
  app.post(path('/schedule'), isAuthorized, scheduleController.create)
  app.get(path('/schedule/:id'), isAuthorized, scheduleController.get)
  app.get(path('/schedule'), isAuthorized, scheduleController.find)
  app.patch(path('/schedule/:id'), isAuthorized, scheduleController.patch)
  app.del(path('/schedule/:id'), isAuthorized, scheduleController.remove)
}
