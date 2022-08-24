const errorHandler = (err, req, res, next) => {
  const message = err.stack || err;
  console.error(message);
  res.status(500).send(err.message || err);
  next();
};

module.exports = errorHandler;
