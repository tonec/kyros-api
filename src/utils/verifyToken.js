import jwt from 'jsonwebtoken'

export default token => {
  return jwt.verify(token, 'some secret', (error, decode) => {
    if (error) {
      return null
    }
    return decode
  })
}
