const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
  numero_salle: {
    type: String,
    required: [true, 'Le numéro de salle est requis'],
    unique: true,
    trim: true
  },
  nom: {
    type: String,
    required: [true, 'Le nom de la salle est requis'],
    trim: true
  },
  adresse_salle: {
    rue: {
      type: String,
      required: [true, 'L\'adresse est requise']
    },
    ville: {
      type: String,
      required: [true, 'La ville est requise']
    },
    codePostal: {
      type: String,
      required: [true, 'Le code postal est requis']
    },
    pays: {
      type: String,
      default: 'France'
    }
  },
  capacite: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité minimum est de 1 personne']
  },
  horaires: {
    lundi: { ouverture: String, fermeture: String },
    mardi: { ouverture: String, fermeture: String },
    mercredi: { ouverture: String, fermeture: String },
    jeudi: { ouverture: String, fermeture: String },
    vendredi: { ouverture: String, fermeture: String },
    samedi: { ouverture: String, fermeture: String },
    dimanche: { ouverture: String, fermeture: String }
  },
  telephone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


salleSchema.virtual('equipements', {
  ref: 'Equipement',
  localField: '_id',
  foreignField: 'salle'
});

salleSchema.virtual('abonnements', {
  ref: 'Abonnement',
  localField: '_id',
  foreignField: 'salle'
});

const Salle = mongoose.model('Salle', salleSchema);

module.exports = Salle; 
