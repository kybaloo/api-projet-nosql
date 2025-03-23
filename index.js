const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

// Load env vars
dotenv.config({ path: './.env' });
console.log('Environment variables loaded');

// Import Swagger modules
let setupSwagger;
try {
  const swaggerJsDoc = require('swagger-jsdoc');
  console.log('swagger-jsdoc imported successfully');
  const swaggerUi = require('swagger-ui-express');
  console.log('swagger-ui-express imported successfully');
  setupSwagger = require('./swagger');
  console.log('Swagger setup module imported successfully');
} catch (err) {
  console.error('Error importing Swagger modules:', err);
}

const app = express();
const PORT = process.env.PORT || 3000;
console.log(`Port set to ${PORT}`);

// Connexion à la base de données
try {
  console.log('Connecting to database...');
  connectDB();
  console.log('Database connection initiated');
} catch (err) {
  console.error('Error connecting to database:', err);
}

// Middleware pour parser le JSON
app.use(express.json());
console.log('JSON middleware set up');

// Cookie parser
app.use(cookieParser());
console.log('Cookie parser middleware set up');

// Setup Swagger
if (setupSwagger) {
  try {
    console.log('Setting up Swagger...');
    setupSwagger(app);
    console.log('Swagger set up successfully');
  } catch (err) {
    console.error('Error setting up Swagger:', err);
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('API SytSaS - Système de gestion de salle de sport');
});
console.log('Root route set up');

// Import des routes
console.log('Importing routes...');
const adherentRoutes = require('./routes/adherentRoutes');
const entraineurRoutes = require('./routes/entraineurRoutes');
const salleRoutes = require('./routes/salleRoutes');
const equipementRoutes = require('./routes/equipementRoutes');
const abonnementRoutes = require('./routes/abonnementRoutes');
const horaireRoutes = require('./routes/horaireRoutes');
const disponibiliteRoutes = require('./routes/disponibiliteRoutes');
const carriereRoutes = require('./routes/carriereRoutes');
const authRoutes = require('./routes/authRoutes');
console.log('Routes imported successfully');

// Utilisation des routes
console.log('Setting up route handlers...');
app.use('/api/adherents', adherentRoutes);
app.use('/api/entraineurs', entraineurRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/equipements', equipementRoutes);
app.use('/api/abonnements', abonnementRoutes);
app.use('/api/horaires', horaireRoutes);
app.use('/api/disponibilites', disponibiliteRoutes);
app.use('/api/carrieres', carriereRoutes);
app.use('/api/auth', authRoutes);
console.log('Route handlers set up successfully');

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});
console.log('404 handler set up');

// Démarrage du serveur
try {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Documentation Swagger disponible à l'adresse: http://localhost:${PORT}/api-docs`);
  });
  console.log('Server start initiated');
} catch (err) {
  console.error('Error starting server:', err);
}

module.exports = app; 