const mongoose = require('mongoose');

// Options to enable schema inheritance
const options = { discriminatorKey: 'type', collection: 'persons' };

// Generic Person schema
const personSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'First name is required'],
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
    required: [true, 'Phone number is required'],
    match: [/^(\+[0-9]{1,3})?[0-9]{9,10}$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
}, options);

// Create the Person model
const Person = mongoose.model('Person', personSchema);

module.exports = { 
  Person,
  personSchema
}; 