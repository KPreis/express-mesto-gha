const router = require('express').Router();
const { PAGE_NOT_FOUND_CODE } = require('../consts/error_codes');

router.all('/*', (req, res) => {
  res.status(PAGE_NOT_FOUND_CODE).send({ message: 'Page Not Found' });
});

module.exports = router;
