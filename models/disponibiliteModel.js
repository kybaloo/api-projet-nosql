const mongoose = require('mongoose');

const disponibiliteSchema = new mongoose.Schema({
  entraineur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entraineur',
    required: [true, 'L\'entraîneur est requis']
  },
  date_dispo: {
    type: Date,
    required: [true, 'La date de disponibilité est requise']
  },
  heure_debut: {
    type: String,
    required: [true, 'L\'heure de début est requise'],
    match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },
  heure_fin: {
    type: String,
    required: [true, 'L\'heure de fin est requise'],
    match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },
  recurrence: {
    type: String,
    enum: ['Aucune', 'Hebdomadaire', 'Mensuelle'],
    default: 'Aucune'
  },
  finRecurrence: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  reserve: {
    type: Boolean,
    default: false
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});


disponibiliteSchema.path('heure_fin').validate(function(value) {
  if (!this.heure_debut || !value) return true;
  
  const [debutHeures, debutMinutes] = this.heure_debut.split(':').map(Number);
  const [finHeures, finMinutes] = value.split(':').map(Number);
  
  const debutTotal = debutHeures * 60 + debutMinutes;
  const finTotal = finHeures * 60 + finMinutes;
  
  
  return finTotal > debutTotal || (finHeures < debutHeures);
}, 'L\'heure de fin doit être après l\'heure de début');


disponibiliteSchema.pre('save', function(next) {
  if (this.recurrence !== 'Aucune' && !this.finRecurrence) {
    this.finRecurrence = new Date();
    this.finRecurrence.setMonth(this.finRecurrence.getMonth() + 3); 
  }
  next();
});

const Disponibilite = mongoose.model('Disponibilite', disponibiliteSchema);

module.exports = Disponibilite; 
