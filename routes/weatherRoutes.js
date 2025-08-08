const FetchWeather = require("../controllers/weatherController");

async function weatherRouter(fastify, options) {
  const weatherRoute = {
    schema: {
      body: {
        type: "object",
        required: ["location"],
        properties: {
          location: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                coordinates: {
                  type: "object",
                  properties: {
                    lat: { type: "number" },
                    lon: { type: "number" },
                  },
                  required: ["lat", "lon"],
                },
                location: { type: "string" },
                summary: { type: "string" },
                today: {
                  type: "object",
                  properties: {
                    date: { type: "string" },
                    temp: { type: "number" },
                    feelsLike: { type: "number" },
                    humidity: { type: "number" },
                    precipitationProbability: { type: "number" },
                    condition: { type: "string" },
                  },
                  required: [
                    "date",
                    "temp",
                    "feelsLike",
                    "humidity",
                    "precipitationProbability",
                    "condition",
                  ],
                },
              },
              required: ["coordinates", "location", "summary", "today"],
            },
          },
          required: ["success", "message", "data"],
        },
      },
    },
    handler: FetchWeather,
  };

  fastify.post("/weather", weatherRoute);
};

module.exports = weatherRouter;