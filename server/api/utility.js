const makeError = (status, message) => {
  const err = new Error(message)
  err.status = status
  return err
}

const isLoggedIn = (req, res, next) => {
  if (!req.user) next(makeError(401, 'Please login first'))
  next()
}

const isAdmin = (req, res, next) => {
  if(!req.user.isAdmin) next(makeError(403, 'Access forbidden'))
  next()
}

module.exports = {
  makeError,
  isLoggedIn,
  isAdmin
}
