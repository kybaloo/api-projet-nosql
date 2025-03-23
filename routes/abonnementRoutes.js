const express = require('express');
const abonnementController = require('../controllers/abonnementController');

const router = express.Router();

// Routes CRUD de base
router.route('/')
  .get(abonnementController.getAllAbonnements)
  .post(abonnementController.createAbonnement);

router.route('/:id')
  .get(abonnementController.getAbonnement)
  .patch(abonnementController.updateAbonnement)
  .delete(abonnementController.deleteAbonnement);

// Routes spécifiques
router.get('/actifs', abonnementController.getAbonnementsActifs);
router.post('/souscrire', abonnementController.souscrireAbonnement);
router.patch('/:id/renouveler', abonnementController.renouvelerAbonnement);
router.patch('/:id/resilier', abonnementController.resilierAbonnement);

module.exports = router; 