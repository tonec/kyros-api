import { path, isAuthorized } from '../utils'
import serviceController from '../controllers/serviceController'

export default app => {
  app.post(path('/service'), isAuthorized, serviceController.create)
  app.get(path('/service/:id'), isAuthorized, serviceController.get)
  app.get(path('/service'), isAuthorized, serviceController.find)
  app.patch(path('/service/:id'), isAuthorized, serviceController.patch)
  app.del(path('/service/:id'), isAuthorized, serviceController.remove)
}
