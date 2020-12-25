import { UnauthorizedError } from 'restify-errors'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel'
import verifyToken from '../utils/verifyToken'

export default {
  login: (req, res, next) => {
    UserModel.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return next(new UnauthorizedError('User not found'))
        }

        if (!user.comparePasswords(req.body.password)) {
          return next(
            new UnauthorizedError(
              'The password entered does not match our records',
            ),
          )
        }

        res.json({
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          auth: {
            accessToken: jwt.sign(
              {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              },
              process.env.JWT_SECTRET,
            ),
            expires: 1,
          },
        })
      })
      .catch(next)
  },

  verify: (req, res, next) => {
    const { kyros } = req.cookies
    const cookie = kyros ? JSON.parse(kyros) : null

    if (cookie && cookie.accessToken) {
      const verified = verifyToken(cookie.accessToken)

      if (verified) {
        res.send(verified)
        return
      }
    }

    res.send(null)
  },
}
