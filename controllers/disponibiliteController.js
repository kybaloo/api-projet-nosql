const Disponibilite = require('../models/disponibiliteModel');
const Entraineur = require('../models/entraineurModel');
const crudController = require('./crudController');


exports.getAllDisponibilites = crudController.getAll(Disponibilite);
exports.getDisponibilite = crudController.getOne(Disponibilite, { path: 'entraineur', select: 'nom prenom specialite' });
exports.createDisponibilite = crudController.createOne(Disponibilite);
exports.updateDisponibilite = crudController.updateOne(Disponibilite);
exports.deleteDisponibilite = crudController.deleteOne(Disponibilite);




exports.getDisponibilitesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Format de date invalide. Utilisez le format YYYY-MM-DD'
      });
    }
    
    
    const debutJour = new Date(dateObj);
    debutJour.setHours(0, 0, 0, 0);
    
    const finJour = new Date(dateObj);
    finJour.setHours(23, 59, 59, 999);
    
    
    const disponibilites = await Disponibilite.find({
      date_dispo: { $gte: debutJour, $lte: finJour },
      reserve: false
    }).populate('entraineur', 'nom prenom specialite')
      .sort({ heure_debut: 1 });
    
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


exports.reserverDisponibilite = async (req, res) => {
  try {
    const disponibilite = await Disponibilite.findById(req.params.id);
    
    if (!disponibilite) {
      return res.status(404).json({
        status: 'fail',
        message: 'Disponibilité non trouvée'
      });
    }
    
    if (disponibilite.reserve) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cette disponibilité est déjà réservée'
      });
    }
    
    disponibilite.reserve = true;
    
    
    if (req.body.details) {
      disponibilite.notes = disponibilite.notes 
        ? `${disponibilite.notes}\nRéservation: ${req.body.details}`
        : `Réservation: ${req.body.details}`;
    }
    
    await disponibilite.save();
    
    res.status(200).json({
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


exports.annulerReservation = async (req, res) => {
  try {
    const disponibilite = await Disponibilite.findById(req.params.id);
    
    if (!disponibilite) {
      return res.status(404).json({
        status: 'fail',
        message: 'Disponibilité non trouvée'
      });
    }
    
    if (!disponibilite.reserve) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cette disponibilité n\'est pas réservée'
      });
    }
    
    disponibilite.reserve = false;
    
    
    if (req.body.raison) {
      disponibilite.notes = disponibilite.notes 
        ? `${disponibilite.notes}\nAnnulation: ${req.body.raison}`
        : `Annulation: ${req.body.raison}`;
    }
    
    await disponibilite.save();
    
    res.status(200).json({
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


exports.creerDisponibilitesRecurrentes = async (req, res) => {
  try {
    const { entraineur, date_dispo, heure_debut, heure_fin, recurrence, nbOccurrences } = req.body;
    
    
    const entraineurExists = await Entraineur.findById(entraineur);
    if (!entraineurExists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Entraîneur non trouvé'
      });
    }
    
    
    const dateInitiale = new Date(date_dispo);
    if (isNaN(dateInitiale.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Format de date invalide. Utilisez le format YYYY-MM-DD'
      });
    }
    
    
    if (!['Hebdomadaire', 'Mensuelle'].includes(recurrence)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Type de récurrence invalide. Les valeurs valides sont: Hebdomadaire, Mensuelle'
      });
    }
    
    
    const nombreOccurrences = nbOccurrences || 4;
    
    const disponibilitesCreees = [];
    
    
    for (let i = 0; i < nombreOccurrences; i++) {
      const dateCourante = new Date(dateInitiale);
      
      if (recurrence === 'Hebdomadaire') {
        dateCourante.setDate(dateCourante.getDate() + (i * 7)); 
      } else if (recurrence === 'Mensuelle') {
        dateCourante.setMonth(dateCourante.getMonth() + i); 
      }
      
      const nouvelleDisponibilite = await Disponibilite.create({
        entraineur,
        date_dispo: dateCourante,
        heure_debut,
        heure_fin,
        recurrence: i === 0 ? recurrence : 'Aucune', 
        notes: req.body.notes || ''
      });
      
      disponibilitesCreees.push(nouvelleDisponibilite);
    }
    
    res.status(201).json({
      status: 'success',
      count: disponibilitesCreees.length,
      data: disponibilitesCreees
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}; 
