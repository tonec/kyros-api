import { path, isAuthorized } from '../utils'
import resourceController from '../controllers/resourceController'

export default app => {
  app.get(path('/resource'), isAuthorized, resourceController.query)
  app.get(path('/resource/:id'), isAuthorized, resourceController.detail)
  app.post(path('/resource'), isAuthorized, resourceController.insert)
  app.patch(path('/resource/'), isAuthorized, resourceController.update)
  app.del(path('/resource/'), isAuthorized, resourceController.delete)
}
