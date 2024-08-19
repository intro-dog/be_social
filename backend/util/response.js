module.exports.responseReturn = (res, statusCode, data) => {
  return res.status(statusCode).json(data)
}
