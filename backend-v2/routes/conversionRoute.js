const express = require('express');
const router = express.Router();

const controller = require('../controllers/conversionController');

router.post('/txt-to-xml',  controller.txtToXml);
router.post('/txt-to-json', controller.txtToJson);
router.post('/xml-to-txt',  controller.xmlToTxt);
router.post('/json-to-txt', controller.jsonToTxt);

module.exports = router;
