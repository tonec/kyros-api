import jwt from 'jsonwebtoken'

export default token => {
  return jwt.verify(token, process.env.JWT_SECTRET, (error, decode) => {
    if (error) {
      return null
    }
    return decode
  })
}
