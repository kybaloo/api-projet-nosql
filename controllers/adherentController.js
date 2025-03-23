const Adherent = require('../models/adherentModel');
const Abonnement = require('../models/abonnementModel');
const crudController = require('./crudController');


exports.getAllAdherents = crudController.getAll(Adherent);
exports.getAdherent = crudController.getOne(Adherent);
exports.createAdherent = crudController.createOne(Adherent);
exports.updateAdherent = crudController.updateOne(Adherent);
exports.deleteAdherent = crudController.deleteOne(Adherent);




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
    
    
    adherent.suiviPoids.push({
      date: new Date(),
      poids,
      commentaire: commentaire || ''
    });
    
    
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


exports.getAdherentsWithActiveSubscriptions = async (req, res) => {
  try {
    const adherents = await Adherent.find();
    const result = [];
    
    
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
