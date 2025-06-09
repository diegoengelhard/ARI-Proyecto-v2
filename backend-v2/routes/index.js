const express = require('express');
const router = express.Router();

const conversionRoute = require('./conversionRoute');

router.use('/conversion', conversionRoute);

module.exports = router;
