const mongoose = require('mongoose');

const equipementSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: [true, 'Le numéro d\'équipement est requis'],
    unique: true,
    trim: true
  },
  nom: {
    type: String,
    required: [true, 'Le nom de l\'équipement est requis'],
    trim: true
  },
  fonction: {
    type: String,
    required: [true, 'La fonction de l\'équipement est requise'],
    enum: ['Cardio', 'Musculation', 'Poids libres', 'Cours collectifs', 'Autre']
  },
  description: {
    type: String,
    trim: true
  },
  quantite: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [1, 'La quantité minimum est de 1'],
    default: 1
  },
  salle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salle',
    required: [true, 'La salle est requise']
  },
  marque: {
    type: String,
    trim: true
  },
  modele: {
    type: String,
    trim: true
  },
  dateAchat: {
    type: Date
  },
  prixAchat: {
    type: Number,
    min: [0, 'Le prix ne peut pas être négatif']
  },
  dateDerniereMaintenance: {
    type: Date
  },
  etat: {
    type: String,
    enum: ['Neuf', 'Bon', 'Correct', 'Usé', 'À réparer', 'Hors service'],
    default: 'Neuf'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});


equipementSchema.methods.estDisponible = function() {
  return this.etat !== 'À réparer' && this.etat !== 'Hors service' && this.quantite > 0;
};

const Equipement = mongoose.model('Equipement', equipementSchema);

module.exports = Equipement; 
