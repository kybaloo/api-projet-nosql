const mongoose = require('mongoose');

const horaireSchema = new mongoose.Schema({
  entraineur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entraineur',
    required: [true, 'L\'entraîneur est requis']
  },
  salle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salle',
    required: [true, 'La salle est requise']
  },
  nomCours: {
    type: String,
    required: [true, 'Le nom du cours est requis'],
    trim: true
  },
  jour: {
    type: String,
    required: [true, 'Le jour est requis'],
    enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  },
  debut: {
    type: String,
    required: [true, 'L\'heure de début est requise'],
    match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },
  fin: {
    type: String,
    required: [true, 'L\'heure de fin est requise'],
    match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },
  duree: {
    type: Number,
    min: [15, 'La durée minimum est de 15 minutes'],
    max: [240, 'La durée maximum est de 240 minutes (4 heures)']
  },
  capacite: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité minimum est de 1 personne']
  },
  niveau: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'],
    default: 'Tous niveaux'
  },
  description: {
    type: String,
    trim: true
  },
  actif: {
    type: Boolean,
    default: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

// Calcul automatique de la durée à partir des heures de début et de fin
horaireSchema.pre('save', function(next) {
  if (this.debut && this.fin) {
    const [debutHeures, debutMinutes] = this.debut.split(':').map(Number);
    const [finHeures, finMinutes] = this.fin.split(':').map(Number);
    
    let dureeMinutes = (finHeures * 60 + finMinutes) - (debutHeures * 60 + debutMinutes);
    
    // Si la durée est négative (par exemple cours finissant après minuit)
    if (dureeMinutes < 0) {
      dureeMinutes += 24 * 60; // Ajouter 24 heures en minutes
    }
    
    this.duree = dureeMinutes;
  }
  next();
});

// Vérification de la validité des heures
horaireSchema.path('fin').validate(function(value) {
  if (!this.debut || !value) return true;
  
  const [debutHeures, debutMinutes] = this.debut.split(':').map(Number);
  const [finHeures, finMinutes] = value.split(':').map(Number);
  
  const debutTotal = debutHeures * 60 + debutMinutes;
  const finTotal = finHeures * 60 + finMinutes;
  
  // La fin peut être avant le début uniquement si le cours traverse minuit
  return finTotal !== debutTotal;
}, 'L\'heure de fin doit être différente de l\'heure de début');

const Horaire = mongoose.model('Horaire', horaireSchema);

module.exports = Horaire; 