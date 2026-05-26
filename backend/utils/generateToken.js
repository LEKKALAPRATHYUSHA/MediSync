const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'medisync_secret_key'

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    SECRET,
    { expiresIn: '7d' }
  )
}

module.exports = generateToken