const router = require('express').Router();

router.all('/*', (req, res) => {
  res.status(404).send({ message: 'Page Not Found' });
});

module.exports = router;
