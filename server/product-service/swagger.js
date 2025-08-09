import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product Service API',
    version: '1.0.0',
    description: 'Microservice for fetching and managing products from WooCommerce into MongoDB',
    contact: {
      name: 'ConvertCart Product Service',
      url: 'https://convert-cart-assignment-beta.vercel.app'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server'
    },
    {
      url: 'https://product-service-9w3j.onrender.com',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Products',
      description: 'Product management operations'
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