import { path, isAuthorized } from '../utils'
import resourceTypeController from '../controllers/resourceTypeController'

export default app => {
  app.post(path('/resourcetype'), isAuthorized, resourceTypeController.create)
  app.get(path('/resourcetype/:id'), isAuthorized, resourceTypeController.get)
  app.get(path('/resourcetype'), isAuthorized, resourceTypeController.find)
  app.patch(path('/resourcetype/:id'), isAuthorized, resourceTypeController.patch)
  app.del(path('/resourcetype/:id'), isAuthorized, resourceTypeController.remove)
}
