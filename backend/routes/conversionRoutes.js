const { Router } = require('express');
const {
  txtToXml,
  txtToJson,
  xmlToTxt,
  jsonToTxt
} = require('../controllers/conversionController.js');

const router = Router();

router.post('/txt-to-xml',  txtToXml);
router.post('/txt-to-json', txtToJson);
router.post('/xml-to-txt',  xmlToTxt);
router.post('/json-to-txt', jsonToTxt);

module.exports = router;