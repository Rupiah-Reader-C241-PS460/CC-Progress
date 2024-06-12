const express = require('express');
const { postPredictHandler, getHistoriesHandler } = require('./handler');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 5000000 } });

const router = express.Router();

router.post('/predict', upload.single('image'), postPredictHandler);
router.get('/predict/histories', getHistoriesHandler);

module.exports = router;
