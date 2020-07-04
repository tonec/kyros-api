import { path, isAuthorized } from '../utils'
import userController from '../controllers/userController'

export default app => {
  app.get(path('/users'), isAuthorized, userController.query)
  app.get(path('/users/:id'), isAuthorized, userController.detail)
  app.post(path('/users'), isAuthorized, userController.insert)
  // app.patch(path('/users/'), authController.loginRequired, userController.update)
  // app.del(path('/users/'), authController.loginRequired, userController.delete)
}
