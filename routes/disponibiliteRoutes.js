const express = require('express');
const disponibiliteController = require('../controllers/disponibiliteController');

const router = express.Router();

// Routes CRUD de base
router.route('/')
  .get(disponibiliteController.getAllDisponibilites)
  .post(disponibiliteController.createDisponibilite);

router.route('/:id')
  .get(disponibiliteController.getDisponibilite)
  .patch(disponibiliteController.updateDisponibilite)
  .delete(disponibiliteController.deleteDisponibilite);

// Routes spécifiques
router.get('/date/:date', disponibiliteController.getDisponibilitesByDate);
router.patch('/:id/reserver', disponibiliteController.reserverDisponibilite);
router.patch('/:id/annuler', disponibiliteController.annulerReservation);
router.post('/recurrence', disponibiliteController.creerDisponibilitesRecurrentes);

module.exports = router; 