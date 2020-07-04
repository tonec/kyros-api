import { UnauthorizedError } from 'restify-errors'

export default (req, res, next) => {
  if (req.user) {
    return next()
  }

  return next(
    new UnauthorizedError('Action not permitted')
  )
}
