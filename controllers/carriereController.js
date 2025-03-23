const Carriere = require('../models/carriereModel');
const Entraineur = require('../models/entraineurModel');
const Salle = require('../models/salleModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllCarrieres = crudController.getAll(Carriere);
exports.getCarriere = crudController.getOne(Carriere, [
  { path: 'entraineur', select: 'nom prenom specialite' },
  { path: 'salle', select: 'nom numero_salle' }
]);
exports.createCarriere = crudController.createOne(Carriere);
exports.updateCarriere = crudController.updateOne(Carriere);
exports.deleteCarriere = crudController.deleteOne(Carriere);

// Fonctionnalités spécifiques aux carrières

// Récupérer toutes les carrières actives
exports.getCarrieresActives = async (req, res) => {
  try {
    const carrieres = await Carriere.find({
      actif: true,
      $or: [
        { date_fin: { $exists: false } },
        { date_fin: { $gte: new Date() } }
      ]
    }).populate('entraineur', 'nom prenom specialite')
      .populate('salle', 'nom numero_salle')
      .sort({ date_debut: -1 });
    
    res.status(200).json({
      status: 'success',
      count: carrieres.length,
      data: carrieres
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Terminer une carrière
exports.terminerCarriere = async (req, res) => {
  try {
    const carriere = await Carriere.findById(req.params.id);
    
    if (!carriere) {
      return res.status(404).json({
        status: 'fail',
        message: 'Carrière non trouvée'
      });
    }
    
    if (!carriere.actif || carriere.date_fin) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cette carrière est déjà terminée'
      });
    }
    
    // Définir la date de fin
    carriere.date_fin = req.body.date_fin || new Date();
    carriere.actif = false;
    
    await carriere.save();
    
    res.status(200).json({
      status: 'success',
      data: carriere
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Ajouter une performance
exports.ajouterPerformance = async (req, res) => {
  try {
    const { note, commentaire } = req.body;
    
    if (!note || note < 0 || note > 5) {
      return res.status(400).json({
        status: 'fail',
        message: 'La note doit être comprise entre 0 et 5'
      });
    }
    
    const carriere = await Carriere.findById(req.params.id);
    
    if (!carriere) {
      return res.status(404).json({
        status: 'fail',
        message: 'Carrière non trouvée'
      });
    }
    
    // Ajouter la nouvelle performance
    carriere.performances.push({
      date: new Date(),
      note,
      commentaire: commentaire || ''
    });
    
    await carriere.save();
    
    res.status(201).json({
      status: 'success',
      data: carriere
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Récupérer les performances d'une carrière
exports.getPerformances = async (req, res) => {
  try {
    const carriere = await Carriere.findById(req.params.id);
    
    if (!carriere) {
      return res.status(404).json({
        status: 'fail',
        message: 'Carrière non trouvée'
      });
    }
    
    // Trier les performances par date décroissante
    const performances = carriere.performances.sort((a, b) => b.date - a.date);
    
    res.status(200).json({
      status: 'success',
      count: performances.length,
      data: performances
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}; 