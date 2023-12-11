const logRequest = (req, res, next) => {
  console.log("Terjadi req ke PATCH:", req.path);
  next()
}

module.exports =logRequest