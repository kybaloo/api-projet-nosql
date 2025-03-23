const Entraineur = require('../models/entraineurModel');
const Horaire = require('../models/horaireModel');
const Disponibilite = require('../models/disponibiliteModel');
const Carriere = require('../models/carriereModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllEntraineurs = crudController.getAll(Entraineur);
exports.getEntraineur = crudController.getOne(Entraineur);
exports.createEntraineur = crudController.createOne(Entraineur);
exports.updateEntraineur = crudController.updateOne(Entraineur);
exports.deleteEntraineur = crudController.deleteOne(Entraineur);

// Fonctionnalités spécifiques aux entraîneurs

// Récupérer les horaires d'un entraîneur
exports.getHorairesEntraineur = async (req, res) => {
  try {
    const horaires = await Horaire.find({ entraineur: req.params.id })
      .populate('salle', 'nom numero_salle');
    
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

// Récupérer les disponibilités d'un entraîneur
exports.getDisponibilitesEntraineur = async (req, res) => {
  try {
    const disponibilites = await Disponibilite.find({ 
      entraineur: req.params.id,
      date_dispo: { $gte: new Date() },
      reserve: false
    }).sort({ date_dispo: 1 });
    
    res.status(200).json({
      status: 'success',
      count: disponibilites.length,
      data: disponibilites
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Récupérer la carrière d'un entraîneur
exports.getCarrieresEntraineur = async (req, res) => {
  try {
    const carrieres = await Carriere.find({ entraineur: req.params.id })
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

// Créer une disponibilité pour un entraîneur
exports.createDisponibilite = async (req, res) => {
  try {
    // Ajouter l'id de l'entraîneur au corps de la requête
    req.body.entraineur = req.params.id;
    
    // Vérifier si l'entraîneur existe
    const entraineur = await Entraineur.findById(req.params.id);
    
    if (!entraineur) {
      return res.status(404).json({
        status: 'fail',
        message: 'Entraîneur non trouvé'
      });
    }
    
    // Créer la disponibilité
    const disponibilite = await Disponibilite.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: disponibilite
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Obtenir les entraîneurs disponibles pour une date donnée
exports.getEntraineursDisponibles = async (req, res) => {
  try {
    const { date, heure_debut, heure_fin } = req.query;
    
    if (!date || !heure_debut || !heure_fin) {
      return res.status(400).json({
        status: 'fail',
        message: 'Veuillez fournir une date, une heure de début et une heure de fin'
      });
    }
    
    // Convertir la date au format Date
    const dateObj = new Date(date);
    
    // Rechercher les disponibilités correspondantes
    const disponibilites = await Disponibilite.find({
      date_dispo: { $eq: dateObj },
      heure_debut: { $lte: heure_debut },
      heure_fin: { $gte: heure_fin },
      reserve: false
    }).populate('entraineur');
    
    // Extraire les entraîneurs des disponibilités
    const entraineurs = disponibilites.map(dispo => dispo.entraineur);
    
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