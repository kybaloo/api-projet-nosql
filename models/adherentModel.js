const mongoose = require('mongoose');
const { Personne } = require('./personneModel');

// Schéma spécifique pour Adhérent
const adherentSchema = new mongoose.Schema({
  num_membre: {
    type: String,
    required: [true, 'Le numéro de membre est requis'],
    unique: true,
    trim: true
  },
  poids: {
    type: Number,
    min: [30, 'Le poids minimum est de 30 kg'],
    max: [300, 'Le poids maximum est de 300 kg']
  },
  taille: {
    type: Number,
    min: [100, 'La taille minimum est de 100 cm'],
    max: [250, 'La taille maximum est de 250 cm']
  },
  objectif: {
    type: String,
    enum: ['Perte de poids', 'Prise de masse', 'Remise en forme', 'Compétition', 'Autre'],
    default: 'Remise en forme'
  },
  suiviPoids: [{
    date: {
      type: Date,
      default: Date.now
    },
    poids: Number,
    commentaire: String
  }],
  dateInscription: {
    type: Date,
    default: Date.now
  }
});

// Création du modèle Adhérent comme discriminateur de Personne
const Adherent = Personne.discriminator('Adherent', adherentSchema);

module.exports = Adherent; 