const Abonnement = require('../models/abonnementModel');
const Adherent = require('../models/adherentModel');
const Salle = require('../models/salleModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllAbonnements = crudController.getAll(Abonnement);
exports.getAbonnement = crudController.getOne(Abonnement, [
  { path: 'adherent', select: 'nom prenom email telephone' },
  { path: 'salle', select: 'nom numero_salle adresse_salle' }
]);
exports.createAbonnement = crudController.createOne(Abonnement);
exports.updateAbonnement = crudController.updateOne(Abonnement);
exports.deleteAbonnement = crudController.deleteOne(Abonnement);

// Fonctionnalités spécifiques aux abonnements

// Créer un nouvel abonnement avec validation
exports.souscrireAbonnement = async (req, res) => {
  try {
    const { adherent, salle, type, date_debut, date_fin, montant } = req.body;
    
    // Vérifier si l'adhérent existe
    const adherentExists = await Adherent.findById(adherent);
    if (!adherentExists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Adhérent non trouvé'
      });
    }
    
    // Vérifier si la salle existe
    const salleExists = await Salle.findById(salle);
    if (!salleExists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Salle non trouvée'
      });
    }
    
    // Vérifier si l'adhérent a déjà un abonnement actif pour cette salle
    const abonnementExistant = await Abonnement.findOne({
      adherent,
      salle,
      actif: true,
      date_fin: { $gte: new Date() }
    });
    
    if (abonnementExistant) {
      return res.status(400).json({
        status: 'fail',
        message: 'L\'adhérent possède déjà un abonnement actif pour cette salle'
      });
    }
    
    // Créer le nouvel abonnement
    const nouvelAbonnement = await Abonnement.create({
      adherent,
      salle,
      type,
      date_debut,
      date_fin,
      montant,
      actif: true
    });
    
    res.status(201).json({
      status: 'success',
      data: nouvelAbonnement
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Renouveler un abonnement
exports.renouvelerAbonnement = async (req, res) => {
  try {
    const abonnement = await Abonnement.findById(req.params.id);
    
    if (!abonnement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Abonnement non trouvé'
      });
    }
    
    // Calculer la nouvelle date de fin en fonction du type d'abonnement
    const nouvelleDate = new Date(abonnement.date_fin);
    
    switch (abonnement.type) {
      case 'Mensuel':
        nouvelleDate.setMonth(nouvelleDate.getMonth() + 1);
        break;
      case 'Trimestriel':
        nouvelleDate.setMonth(nouvelleDate.getMonth() + 3);
        break;
      case 'Semestriel':
        nouvelleDate.setMonth(nouvelleDate.getMonth() + 6);
        break;
      case 'Annuel':
        nouvelleDate.setFullYear(nouvelleDate.getFullYear() + 1);
        break;
      default:
        nouvelleDate.setMonth(nouvelleDate.getMonth() + 1);
    }
    
    // Mettre à jour l'abonnement
    abonnement.date_fin = nouvelleDate;
    abonnement.actif = true;
    
    // Si un nouveau montant est fourni, le mettre à jour
    if (req.body.montant) {
      abonnement.montant = req.body.montant;
    }
    
    await abonnement.save();
    
    res.status(200).json({
      status: 'success',
      data: abonnement
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Résilier un abonnement
exports.resilierAbonnement = async (req, res) => {
  try {
    const abonnement = await Abonnement.findById(req.params.id);
    
    if (!abonnement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Abonnement non trouvé'
      });
    }
    
    // Mettre à jour l'abonnement
    abonnement.actif = false;
    abonnement.date_fin = new Date(); // Fin immédiate
    
    await abonnement.save();
    
    res.status(200).json({
      status: 'success',
      data: abonnement
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Récupérer tous les abonnements actifs
exports.getAbonnementsActifs = async (req, res) => {
  try {
    const abonnements = await Abonnement.find({
      actif: true,
      date_fin: { $gte: new Date() }
    }).populate('adherent', 'nom prenom')
      .populate('salle', 'nom numero_salle');
    
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