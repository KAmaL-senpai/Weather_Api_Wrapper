require("dotenv").config();

const pino = require("pino-pretty");
const Fastify = require("fastify");
const  weatherRouter  = require("./routes/weatherRoutes");
const swagger = require("@fastify/swagger");
const swaggerUi = require("@fastify/swagger-ui");

const fastify = Fastify({
  logger: {
    pino,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  },
});

fastify.register(swagger, {
  openapi: {
    info: {
      title: "Weather API Wrapper Service",
      description: "Weather data fetching API with Redis caching",
      version:"1.0.0",
    },
  },
});

fastify.register(swaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  transformStaticCSP:(header)=>header
})

fastify.register(weatherRouter, { prefix: "api/v1" });
fastify.get("/", function handler(req, rep) {
  rep.send({ hello: "kamal" });
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
