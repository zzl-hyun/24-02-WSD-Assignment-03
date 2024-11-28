const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WSD assignment 03 Api",
      description: "구인구직 정보를 제공",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Local Development",
      },
      {
        url: "http://113.198.66.75:10042/",
        description: "Test Server",
      }
    ],
    // components: {},
  },
  apis: ["./routes/*.js", "./swagger/*"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};