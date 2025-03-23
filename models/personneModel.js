const mongoose = require('mongoose');


const options = { discriminatorKey: 'type', collection: 'personnes' };


const personneSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  adresse: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: {
      type: String,
      default: 'France'
    }
  },
  telephone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    match: [/^(\+[0-9]{1,3})?[0-9]{9,10}$/, 'Veuillez fournir un numéro de téléphone valide']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
}, options);


const Personne = mongoose.model('Personne', personneSchema);

module.exports = { 
  Personne,
  personneSchema
}; 
