import User from '../models/userModel'

export default {
  query: (req, res, next) => {
    User.find({})
      .then(users => {
        res.json(users)
      })
      .catch(next)
  },

  detail: (req, res, next) => {
    const _id = req.params.id

    User.findById({ _id })
      .then(user => {
        res.json(user)
      })
      .catch(next)
  },

  insert: () => {

  },

  update: () => {

  },

  delete: () => {

  }
}
