const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const mongooseToSwagger = require("mongoose-to-swagger");
const Job = require("../models/Job");
const User = require("../models/User");
const Token = require('../models/Token');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Bookmark = require('../models/Bookmark');
const LoginHistory = require('../models/LoginHistory');
const { default: mongoose } = require("mongoose");
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
      {
        url: "http://localhost:8080/api/",
        description: "Local Development",
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
    "./routes/*.js",
    "./routes/api/*.js",
    "./models/*.js",
    "./controllers/*.controller.js",
    "./services/*.service.js",
  ], // API 경로 추가
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
