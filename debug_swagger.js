console.log('Starting debug...');

try {
  console.log('Importing swagger-jsdoc...');
  const swaggerJsDoc = require('swagger-jsdoc');
  console.log('swagger-jsdoc imported successfully:', typeof swaggerJsDoc);
  
  console.log('Importing swagger-ui-express...');
  const swaggerUi = require('swagger-ui-express');
  console.log('swagger-ui-express imported successfully:', typeof swaggerUi);
  
  console.log('All modules imported successfully!');
} catch (err) {
  console.error('Error importing Swagger modules:', err);
}

console.log('Debug complete.'); 