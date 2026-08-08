const express = require('express');
const trainController = require('../controllers/trainController');

const router = express.Router();

// Get subway train information by train-set number
router.get(
    '/trains/:trainSetNumber',
    trainController.getSubwayTrainByTrainSetNumber
);

module.exports = router;