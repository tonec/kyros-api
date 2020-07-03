import { path } from '../utils'

export default app => {
  app.get(path('/test'), async (req, res) => {
    res.json({ message: 'pass!' })
  })
}
