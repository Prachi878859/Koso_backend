const express = require('express');
const router = express.Router();
const powerStationController = require('../Controllers/powerStationController');

// Middleware (add authentication if needed)
// const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', powerStationController.getAllPowerStations);
router.get('/search', powerStationController.searchPowerStations);
router.get('/stats', powerStationController.getStatistics);
router.get('/:id', powerStationController.getPowerStationById);
router.get('/name/:name', powerStationController.getPowerStationByName);


// Protected routes (add auth middleware if needed)
router.post('/', powerStationController.createPowerStation);
router.put('/:id', powerStationController.updatePowerStation);
router.delete('/:id', powerStationController.deletePowerStation);
router.post('/bulk', powerStationController.bulkCreatePowerStations);

module.exports = router;