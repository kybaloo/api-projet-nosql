const mongoose = require('mongoose');

const abonnementSchema = new mongoose.Schema({
  adherent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adherent',
    required: [true, 'L\'adhérent est requis']
  },
  salle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salle',
    required: [true, 'La salle est requise']
  },
  type: {
    type: String,
    required: [true, 'Le type d\'abonnement est requis'],
    enum: ['Mensuel', 'Trimestriel', 'Semestriel', 'Annuel']
  },
  date_debut: {
    type: Date,
    required: [true, 'La date de début est requise'],
    default: Date.now
  },
  date_fin: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  actif: {
    type: Boolean,
    default: true
  },
  montant: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  modePaiement: {
    type: String,
    enum: ['Carte bancaire', 'Espèces', 'Chèque', 'Prélèvement automatique', 'Autre'],
    default: 'Carte bancaire'
  },
  renouvellementAuto: {
    type: Boolean,
    default: false
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});


abonnementSchema.pre('save', function(next) {
  if (this.date_fin && this.date_debut && this.date_fin <= this.date_debut) {
    return next(new Error('La date de fin doit être postérieure à la date de début'));
  }
  next();
});


abonnementSchema.methods.estActif = function() {
  const now = new Date();
  return this.actif && now >= this.date_debut && now <= this.date_fin;
};

const Abonnement = mongoose.model('Abonnement', abonnementSchema);

module.exports = Abonnement; 
