import authController from '../controllers/authController'
import config from '../../config'

const path = config.basePath

export default app => {
  app.get(path('/auth/verify'), authController.verify)
  app.post(path('/auth/register'), authController.register)
  app.post(path('/auth/login'), authController.login)
}
