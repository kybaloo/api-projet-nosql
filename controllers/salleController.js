const Salle = require('../models/salleModel');
const Equipement = require('../models/equipementModel');
const Adherent = require('../models/adherentModel');
const Abonnement = require('../models/abonnementModel');
const Entraineur = require('../models/entraineurModel');
const Carriere = require('../models/carriereModel');
const crudController = require('./crudController');


exports.getAllSalles = crudController.getAll(Salle);
exports.getSalle = crudController.getOne(Salle);
exports.createSalle = crudController.createOne(Salle);
exports.updateSalle = crudController.updateOne(Salle);
exports.deleteSalle = crudController.deleteOne(Salle);




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


exports.getEntraineursSalle = async (req, res) => {
  try {
    
    const carrieres = await Carriere.find({
      salle: req.params.id,
      actif: true,
      $or: [
        { date_fin: { $exists: false } },
        { date_fin: { $gte: new Date() } }
      ]
    });
    
    
    const entraineurIds = carrieres.map(carriere => carriere.entraineur);
    
    
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


exports.getTauxOccupation = async (req, res) => {
  try {
    const salle = await Salle.findById(req.params.id);
    
    if (!salle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Salle non trouvée'
      });
    }
    
    
    const nombreAbonnements = await Abonnement.countDocuments({
      salle: req.params.id,
      actif: true,
      date_fin: { $gte: new Date() }
    });
    
    
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


exports.addEquipement = async (req, res) => {
  try {
    
    const salle = await Salle.findById(req.params.id);
    
    if (!salle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Salle non trouvée'
      });
    }
    
    
    req.body.salle = req.params.id;
    
    
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
