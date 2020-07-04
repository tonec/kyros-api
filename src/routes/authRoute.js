import authController from '../controllers/authController'
import { path } from '../utils'

export default app => {
  app.get(path('/auth/verify'), authController.verify)
  app.post(path('/auth/login'), authController.login)
}
