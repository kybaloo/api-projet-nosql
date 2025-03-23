const express = require('express');
const carriereController = require('../controllers/carriereController');

const router = express.Router();

// Routes CRUD de base
router.route('/')
  .get(carriereController.getAllCarrieres)
  .post(carriereController.createCarriere);

router.route('/:id')
  .get(carriereController.getCarriere)
  .patch(carriereController.updateCarriere)
  .delete(carriereController.deleteCarriere);

// Routes spécifiques
router.get('/actives', carriereController.getCarrieresActives);
router.patch('/:id/terminer', carriereController.terminerCarriere);
router.post('/:id/performance', carriereController.ajouterPerformance);
router.get('/:id/performances', carriereController.getPerformances);

module.exports = router; 