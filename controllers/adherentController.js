const Adherent = require('../models/adherentModel');
const Abonnement = require('../models/abonnementModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllAdherents = crudController.getAll(Adherent);
exports.getAdherent = crudController.getOne(Adherent);
exports.createAdherent = crudController.createOne(Adherent);
exports.updateAdherent = crudController.updateOne(Adherent);
exports.deleteAdherent = crudController.deleteOne(Adherent);

// Fonctionnalités spécifiques aux adhérents

// Récupérer les abonnements d'un adhérent
exports.getAbonnementsAdherent = async (req, res) => {
  try {
    const abonnements = await Abonnement.find({ adherent: req.params.id })
      .populate('salle', 'nom numero_salle adresse_salle');
    
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

// Ajouter un suivi de poids pour un adhérent
exports.ajouterSuiviPoids = async (req, res) => {
  try {
    const { poids, commentaire } = req.body;
    
    if (!poids) {
      return res.status(400).json({
        status: 'fail',
        message: 'Le poids est requis'
      });
    }
    
    const adherent = await Adherent.findById(req.params.id);
    
    if (!adherent) {
      return res.status(404).json({
        status: 'fail',
        message: 'Adhérent non trouvé'
      });
    }
    
    // Ajouter le nouveau suivi
    adherent.suiviPoids.push({
      date: new Date(),
      poids,
      commentaire: commentaire || ''
    });
    
    // Mettre à jour le poids actuel de l'adhérent
    adherent.poids = poids;
    
    await adherent.save();
    
    res.status(200).json({
      status: 'success',
      data: adherent
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Obtenir l'historique du suivi de poids d'un adhérent
exports.getSuiviPoids = async (req, res) => {
  try {
    const adherent = await Adherent.findById(req.params.id);
    
    if (!adherent) {
      return res.status(404).json({
        status: 'fail',
        message: 'Adhérent non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      count: adherent.suiviPoids.length,
      data: adherent.suiviPoids
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Récupérer tous les adhérents avec leurs abonnements actifs
exports.getAdherentsWithActiveSubscriptions = async (req, res) => {
  try {
    const adherents = await Adherent.find();
    const result = [];
    
    // Pour chaque adhérent, récupérer ses abonnements actifs
    for (const adherent of adherents) {
      const abonnements = await Abonnement.find({
        adherent: adherent._id,
        actif: true,
        date_fin: { $gte: new Date() }
      }).populate('salle', 'nom numero_salle');
      
      if (abonnements.length > 0) {
        result.push({
          adherent,
          abonnements
        });
      }
    }
    
    res.status(200).json({
      status: 'success',
      count: result.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}; 