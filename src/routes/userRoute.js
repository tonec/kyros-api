import config from '../../config'
import authController from '../controllers/authController'
import userController from '../controllers/userController'

const path = config.basePath

export default app => {
  app.get(path('/users'), authController.loginRequired, userController.query)
  app.get(path('/users/:id'), authController.loginRequired, userController.detail)
  app.post(path('/users'), authController.loginRequired, userController.insert)
  // app.patch(path('/users/'), authController.loginRequired, userController.update)
  // app.del(path('/users/'), authController.loginRequired, userController.delete)
}
