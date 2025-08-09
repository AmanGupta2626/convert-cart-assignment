import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Segment Service API',
    version: '1.0.0',
    description: 'Microservice for evaluating product segments based on user-defined rules',
    contact: {
      name: 'ConvertCart Segment Service',
      url: 'https://convert-cart-assignment-beta.vercel.app'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://segment-service.onrender.com',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Segments',
      description: 'Segment evaluation operations'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js',
    './index.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;