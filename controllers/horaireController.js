const Horaire = require('../models/horaireModel');
const Entraineur = require('../models/entraineurModel');
const Salle = require('../models/salleModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllHoraires = crudController.getAll(Horaire);
exports.getHoraire = crudController.getOne(Horaire, [
  { path: 'entraineur', select: 'nom prenom specialite' },
  { path: 'salle', select: 'nom numero_salle' }
]);
exports.createHoraire = crudController.createOne(Horaire);
exports.updateHoraire = crudController.updateOne(Horaire);
exports.deleteHoraire = crudController.deleteOne(Horaire);

// Fonctionnalités spécifiques aux horaires

// Récupérer les horaires par salle
exports.getHorairesBySalle = async (req, res) => {
  try {
    const { salleId } = req.params;
    
    // Vérifier si la salle existe
    const salle = await Salle.findById(salleId);
    if (!salle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Salle non trouvée'
      });
    }
    
    // Récupérer les horaires pour cette salle
    const horaires = await Horaire.find({ salle: salleId, actif: true })
      .populate('entraineur', 'nom prenom specialite')
      .sort({ jour: 1, debut: 1 });
    
    res.status(200).json({
      status: 'success',
      count: horaires.length,
      data: horaires
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Récupérer les horaires par jour
exports.getHorairesByJour = async (req, res) => {
  try {
    const { jour } = req.params;
    
    // Vérifier que le jour est valide
    const joursValides = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    if (!joursValides.includes(jour)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Jour invalide. Les jours valides sont: ' + joursValides.join(', ')
      });
    }
    
    // Récupérer les horaires pour ce jour
    const horaires = await Horaire.find({ jour, actif: true })
      .populate('entraineur', 'nom prenom specialite')
      .populate('salle', 'nom numero_salle')
      .sort({ debut: 1 });
    
    res.status(200).json({
      status: 'success',
      count: horaires.length,
      data: horaires
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Activer un horaire
exports.activerHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.findById(req.params.id);
    
    if (!horaire) {
      return res.status(404).json({
        status: 'fail',
        message: 'Horaire non trouvé'
      });
    }
    
    horaire.actif = true;
    await horaire.save();
    
    res.status(200).json({
      status: 'success',
      data: horaire
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Désactiver un horaire
exports.desactiverHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.findById(req.params.id);
    
    if (!horaire) {
      return res.status(404).json({
        status: 'fail',
        message: 'Horaire non trouvé'
      });
    }
    
    horaire.actif = false;
    await horaire.save();
    
    res.status(200).json({
      status: 'success',
      data: horaire
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}; 