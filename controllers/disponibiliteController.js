const Disponibilite = require('../models/disponibiliteModel');
const Entraineur = require('../models/entraineurModel');
const crudController = require('./crudController');

// Opérations CRUD de base
exports.getAllDisponibilites = crudController.getAll(Disponibilite);
exports.getDisponibilite = crudController.getOne(Disponibilite, { path: 'entraineur', select: 'nom prenom specialite' });
exports.createDisponibilite = crudController.createOne(Disponibilite);
exports.updateDisponibilite = crudController.updateOne(Disponibilite);
exports.deleteDisponibilite = crudController.deleteOne(Disponibilite);

// Fonctionnalités spécifiques aux disponibilités

// Récupérer les disponibilités par date
exports.getDisponibilitesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    // Vérifier que la date est au format valide
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Format de date invalide. Utilisez le format YYYY-MM-DD'
      });
    }
    
    // Définir le début et la fin de la journée
    const debutJour = new Date(dateObj);
    debutJour.setHours(0, 0, 0, 0);
    
    const finJour = new Date(dateObj);
    finJour.setHours(23, 59, 59, 999);
    
    // Récupérer les disponibilités pour cette date
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

// Réserver une disponibilité
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
    
    // Ajouter des détails de réservation si fournis
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

// Annuler une réservation
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
    
    // Ajouter une note d'annulation si fournie
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

// Créer des disponibilités récurrentes
exports.creerDisponibilitesRecurrentes = async (req, res) => {
  try {
    const { entraineur, date_dispo, heure_debut, heure_fin, recurrence, nbOccurrences } = req.body;
    
    // Vérifier si l'entraîneur existe
    const entraineurExists = await Entraineur.findById(entraineur);
    if (!entraineurExists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Entraîneur non trouvé'
      });
    }
    
    // Vérifier que la date est au format valide
    const dateInitiale = new Date(date_dispo);
    if (isNaN(dateInitiale.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Format de date invalide. Utilisez le format YYYY-MM-DD'
      });
    }
    
    // Vérifier que le type de récurrence est valide
    if (!['Hebdomadaire', 'Mensuelle'].includes(recurrence)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Type de récurrence invalide. Les valeurs valides sont: Hebdomadaire, Mensuelle'
      });
    }
    
    // Nombre d'occurrences (défaut: 4)
    const nombreOccurrences = nbOccurrences || 4;
    
    const disponibilitesCreees = [];
    
    // Créer les disponibilités récurrentes
    for (let i = 0; i < nombreOccurrences; i++) {
      const dateCourante = new Date(dateInitiale);
      
      if (recurrence === 'Hebdomadaire') {
        dateCourante.setDate(dateCourante.getDate() + (i * 7)); // Ajouter i semaines
      } else if (recurrence === 'Mensuelle') {
        dateCourante.setMonth(dateCourante.getMonth() + i); // Ajouter i mois
      }
      
      const nouvelleDisponibilite = await Disponibilite.create({
        entraineur,
        date_dispo: dateCourante,
        heure_debut,
        heure_fin,
        recurrence: i === 0 ? recurrence : 'Aucune', // Seule la première occurrence garde le type de récurrence
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