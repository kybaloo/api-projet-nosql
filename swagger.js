const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SytSaS API',
      version: '1.0.0',
      description: 'API for SytSaS - Gym Management System',
      contact: {
        name: 'API Support',
        email: 'support@sytsas.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'User username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password (min 6 characters)'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'manager'],
              description: 'User role'
            }
          }
        },
        Member: {
          type: 'object',
          required: ['nom', 'prenom', 'email', 'telephone', 'num_membre'],
          properties: {
            nom: {
              type: 'string',
              description: 'Member last name'
            },
            prenom: {
              type: 'string',
              description: 'Member first name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Member email address'
            },
            telephone: {
              type: 'string',
              description: 'Member phone number'
            },
            adresse: {
              type: 'object',
              properties: {
                rue: { type: 'string' },
                ville: { type: 'string' },
                codePostal: { type: 'string' },
                pays: { type: 'string' }
              }
            },
            num_membre: {
              type: 'string',
              description: 'Member ID number'
            },
            poids: {
              type: 'number',
              description: 'Member weight in kg'
            },
            taille: {
              type: 'number',
              description: 'Member height in cm'
            },
            objectif: {
              type: 'string',
              enum: ['Perte de poids', 'Prise de masse', 'Remise en forme', 'Compétition', 'Autre'],
              description: 'Member fitness goal'
            }
          }
        }
        // Add more schemas as needed
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}; 