const mongoose = require('mongoose');

const carriereSchema = new mongoose.Schema({
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
  poste: {
    type: String,
    required: [true, 'Le poste est requis'],
    trim: true
  },
  date_debut: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  date_fin: {
    type: Date
  },
  actif: {
    type: Boolean,
    default: true
  },
  salaire: {
    type: Number,
    min: [0, 'Le salaire ne peut pas être négatif']
  },
  responsabilites: {
    type: [String],
    default: []
  },
  performances: [{
    date: Date,
    note: {
      type: Number,
      min: 0,
      max: 5
    },
    commentaire: String
  }],
  dateCreation: {
    type: Date,
    default: Date.now
  }
});


carriereSchema.pre('save', function(next) {
  if (this.date_fin && this.date_debut && this.date_fin <= this.date_debut) {
    return next(new Error('La date de fin doit être postérieure à la date de début'));
  }
  
  
  if (this.date_fin) {
    this.actif = false;
  }
  
  next();
});


carriereSchema.methods.estActive = function() {
  const now = new Date();
  return this.actif && now >= this.date_debut && (!this.date_fin || now <= this.date_fin);
};


carriereSchema.index({ entraineur: 1, salle: 1, actif: 1 }, { 
  unique: true, 
  partialFilterExpression: { actif: true } 
});

const Carriere = mongoose.model('Carriere', carriereSchema);

module.exports = Carriere; 
