const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const mongooseToSwagger = require("mongoose-to-swagger");
// Mongoose 모델 불러오기
const Job = require("../models/Job");
const User = require("../models/User");
const Company = require('../models/Company');
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
        User: mongooseToSwagger(User),
        Company: mongooseToSwagger(Company),
      },
      securitySchemes:{
        bearerAuth:{
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
    },
    securitiy: [
      {
        bearerAuth: [],
      }
    ]
  },
  apis: ["./routes/*.js", "./models/*.js","./controllers/*.controller.js", "./services/*.service.js"], //차차 추가해나가자
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
