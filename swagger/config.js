const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const mongooseToSwagger = require("mongoose-to-swagger");
const { default: mongoose } = require("mongoose");
const Job = require("../src/models/Job");
const User = require("../src/models/User");
const Token = require('../src/models/Token');
const Company = require('../src/models/Company');
const Application = require('../src/models/Application');
const Bookmark = require('../src/models/Bookmark');
const LoginHistory = require('../src/models/LoginHistory');
const Notification = require('../src/models/Notification');
const ErrorResponse = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      example: 'error',
    },
    code: {
      type: 'string',
      example: 'ERROR_CODES',
    },
    message: {
      type: 'string',
      example: 'Error message.',
    },
  },
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WSD Assignment 03 API",
      description: "구인구직 정보를 제공",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://113.198.66.75:10042/api/",
        description: "Real Server",
      },
    ],
    components: {
      schemas: {
        Job: mongooseToSwagger(Job), // Mongoose 스키마를 Swagger 스키마로 변환
        Company: mongooseToSwagger(Company),
        User: mongooseToSwagger(User),
        Application: mongooseToSwagger(Application),
        Bookmark: mongooseToSwagger(Bookmark),
        Token: mongooseToSwagger(Token),
        LoginHistory: mongooseToSwagger(LoginHistory),
        Notification: mongooseToSwagger(Notification),
        ErrorResponse: ErrorResponse,
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        csrfAuth: {
          type: "apiKey",
          in: "header",
          name: "X-CSRF-Token",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
        csrfAuth: [],
      },
    ],
  },
  apis: [
    "./swagger/*",
    "./src/routes/*.js",
    "./src/routes/api/*.js",
    "./src/models/*.js",
    "./src/controllers/*.controller.js",
    "./src/services/*.service.js",
  ], // API 경로 추가
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
