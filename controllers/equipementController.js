const Equipement = require('../models/equipementModel');
const Salle = require('../models/salleModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllEquipements = crudController.getAll(Equipement);
exports.getEquipement = crudController.getOne(Equipement, { path: 'salle', select: 'nom numero_salle' });
exports.createEquipement = crudController.createOne(Equipement);
exports.updateEquipement = crudController.updateOne(Equipement);
exports.deleteEquipement = crudController.deleteOne(Equipement);

// Fonctionnalités spécifiques aux équipements

// Récupérer tous les équipements disponibles (non à réparer et non hors service)
exports.getEquipementsDisponibles = async (req, res) => {
  try {
    const equipements = await Equipement.find({
      etat: { $nin: ['À réparer', 'Hors service'] },
      quantite: { $gt: 0 }
    }).populate('salle', 'nom numero_salle');
    
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

// Récupérer tous les équipements par fonction
exports.getEquipementsByFonction = async (req, res) => {
  try {
    const { fonction } = req.params;
    
    if (!fonction) {
      return res.status(400).json({
        status: 'fail',
        message: 'Veuillez spécifier une fonction'
      });
    }
    
    const equipements = await Equipement.find({ fonction }).populate('salle', 'nom numero_salle');
    
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

// Signaler un équipement à réparer
exports.signalerEquipementAReparer = async (req, res) => {
  try {
    const equipement = await Equipement.findById(req.params.id);
    
    if (!equipement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Équipement non trouvé'
      });
    }
    
    equipement.etat = 'À réparer';
    
    // Ajouter un commentaire si fourni
    if (req.body.commentaire) {
      equipement.description = equipement.description 
        ? `${equipement.description}\n[${new Date().toISOString()}] À réparer: ${req.body.commentaire}`
        : `[${new Date().toISOString()}] À réparer: ${req.body.commentaire}`;
    }
    
    await equipement.save();
    
    res.status(200).json({
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

// Marquer un équipement comme réparé
exports.marquerEquipementRepare = async (req, res) => {
  try {
    const equipement = await Equipement.findById(req.params.id);
    
    if (!equipement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Équipement non trouvé'
      });
    }
    
    equipement.etat = req.body.etat || 'Bon';
    equipement.dateDerniereMaintenance = new Date();
    
    // Ajouter un commentaire si fourni
    if (req.body.commentaire) {
      equipement.description = equipement.description 
        ? `${equipement.description}\n[${new Date().toISOString()}] Réparé: ${req.body.commentaire}`
        : `[${new Date().toISOString()}] Réparé: ${req.body.commentaire}`;
    }
    
    await equipement.save();
    
    res.status(200).json({
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