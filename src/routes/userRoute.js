import { path, isAuthorized } from '../utils'
import userController from '../controllers/userController'

export default app => {
  app.post(path('/user'), userController.create)
  // app.get(path('/user'), isAuthorized, userController.get)
  // app.get(path('/user/:id'), isAuthorized, userController.find)
  // app.patch(path('/user/'), isAuthorized, userController.patch)
  // app.del(path('/user/'), isAuthorized, userController.delete)
}
