const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validatePayload');

const controller = require('../controllers/conversionController');

router.post('/txt-to-xml',  validator('txt-xml'), controller.txtToXml);
router.post('/txt-to-json', validator('txt-json'), controller.txtToJson);
router.post('/xml-to-txt',  validator('xml-txt'), controller.xmlToTxt);
router.post('/json-to-txt', validator('json-txt'), controller.jsonToTxt);

module.exports = router;
