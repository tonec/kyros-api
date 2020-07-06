import { path, isAuthorized } from '../utils'
import userController from '../controllers/userController'

export default app => {
  app.post(path('/user'), isAuthorized, userController.create)
  app.get(path('/user/:id'), isAuthorized, userController.get)
  app.get(path('/user'), isAuthorized, userController.find)
  app.patch(path('/user/:id'), isAuthorized, userController.patch)
  app.del(path('/user/:id'), isAuthorized, userController.remove)
}
