const express = require('express');
const horaireController = require('../controllers/horaireController');

const router = express.Router();

// Routes CRUD de base
router.route('/')
  .get(horaireController.getAllHoraires)
  .post(horaireController.createHoraire);

router.route('/:id')
  .get(horaireController.getHoraire)
  .patch(horaireController.updateHoraire)
  .delete(horaireController.deleteHoraire);

// Routes spécifiques
router.get('/salle/:salleId', horaireController.getHorairesBySalle);
router.get('/jour/:jour', horaireController.getHorairesByJour);
router.patch('/:id/activer', horaireController.activerHoraire);
router.patch('/:id/desactiver', horaireController.desactiverHoraire);

module.exports = router; 