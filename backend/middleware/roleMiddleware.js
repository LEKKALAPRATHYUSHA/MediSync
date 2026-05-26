const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized access' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access forbidden: requires one of [${roles.join(', ')}]` })
    }
    next()
  }
}

module.exports = authorizeRoles