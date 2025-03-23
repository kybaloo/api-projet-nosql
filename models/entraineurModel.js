const mongoose = require('mongoose');
const { Personne } = require('./personneModel');


const entraineurSchema = new mongoose.Schema({
  num_coach: {
    type: String,
    required: [true, 'Le numéro de coach est requis'],
    unique: true,
    trim: true
  },
  specialite: {
    type: String,
    required: [true, 'La spécialité est requise'],
    enum: ['Musculation', 'Cardio', 'Fitness', 'Yoga', 'Pilates', 'CrossFit', 'Natation', 'Arts martiaux', 'Nutrition', 'Autre']
  },
  date_emb: {
    type: Date,
    required: [true, 'La date d\'embauche est requise']
  },
  sal_base: {
    type: Number,
    required: [true, 'Le salaire de base est requis'],
    min: [0, 'Le salaire ne peut pas être négatif']
  },
  certifications: [{
    nom: String,
    organisme: String,
    dateObtention: Date,
    dateExpiration: Date
  }],
  experience: {
    type: Number,
    default: 0,
    min: 0
  }
});


const Entraineur = Personne.discriminator('Entraineur', entraineurSchema);

module.exports = Entraineur; 
