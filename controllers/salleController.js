const Salle = require('../models/salleModel');
const Equipement = require('../models/equipementModel');
const Adherent = require('../models/adherentModel');
const Abonnement = require('../models/abonnementModel');
const Entraineur = require('../models/entraineurModel');
const Carriere = require('../models/carriereModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllSalles = crudController.getAll(Salle);
exports.getSalle = crudController.getOne(Salle);
exports.createSalle = crudController.createOne(Salle);
exports.updateSalle = crudController.updateOne(Salle);
exports.deleteSalle = crudController.deleteOne(Salle);

// Fonctionnalités spécifiques aux salles

// Récupérer tous les équipements d'une salle
exports.getEquipementsSalle = async (req, res) => {
  try {
    const equipements = await Equipement.find({ salle: req.params.id });
    
    res.status(200).json({
      status: 'success',
      count: equipements.length,
      data: equipements
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Récupérer tous les abonnements actifs d'une salle
exports.getAbonnementsSalle = async (req, res) => {
  try {
    const abonnements = await Abonnement.find({
      salle: req.params.id,
      actif: true,
      date_fin: { $gte: new Date() }
    }).populate('adherent', 'nom prenom email telephone');
    
    res.status(200).json({
      status: 'success',
      count: abonnements.length,
      data: abonnements
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Récupérer tous les entraîneurs d'une salle (via leurs carrières actives)
exports.getEntraineursSalle = async (req, res) => {
  try {
    // Trouver les carrières actives pour cette salle
    const carrieres = await Carriere.find({
      salle: req.params.id,
      actif: true,
      $or: [
        { date_fin: { $exists: false } },
        { date_fin: { $gte: new Date() } }
      ]
    });
    
    // Extraire les IDs des entraîneurs
    const entraineurIds = carrieres.map(carriere => carriere.entraineur);
    
    // Récupérer les entraîneurs correspondants
    const entraineurs = await Entraineur.find({
      _id: { $in: entraineurIds }
    });
    
    res.status(200).json({
      status: 'success',
      count: entraineurs.length,
      data: entraineurs
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Récupérer le taux d'occupation d'une salle
exports.getTauxOccupation = async (req, res) => {
  try {
    const salle = await Salle.findById(req.params.id);
    
    if (!salle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Salle non trouvée'
      });
    }
    
    // Compter les abonnements actifs
    const nombreAbonnements = await Abonnement.countDocuments({
      salle: req.params.id,
      actif: true,
      date_fin: { $gte: new Date() }
    });
    
    // Calculer le taux d'occupation
    const tauxOccupation = (nombreAbonnements / salle.capacite) * 100;
    
    res.status(200).json({
      status: 'success',
      data: {
        capacite: salle.capacite,
        abonnements_actifs: nombreAbonnements,
        taux_occupation: tauxOccupation.toFixed(2) + '%'
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Ajouter un équipement à une salle
exports.addEquipement = async (req, res) => {
  try {
    // Vérifier si la salle existe
    const salle = await Salle.findById(req.params.id);
    
    if (!salle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Salle non trouvée'
      });
    }
    
    // Ajouter l'id de la salle au corps de la requête
    req.body.salle = req.params.id;
    
    // Créer le nouvel équipement
    const equipement = await Equipement.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: equipement
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}; 