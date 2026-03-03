const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');


router.get('/projects', apiController.getProjects);
router.post('/contact', apiController.submitContact);

module.exports = router;