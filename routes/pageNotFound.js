const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');

router.all('/*', (req, res, next) => {
  next(new NotFoundError(`страница не найдена`));
});

module.exports = router;
