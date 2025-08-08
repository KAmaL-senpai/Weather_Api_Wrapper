const axios = require("axios");
const Redis = require("ioredis");

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: "default",
  password: process.env.REDIS_PASS,
 
});

const FetchWeather = async (req, rep) => {
  const { location } = req.body;

  const cacheKey = `weather:${location.toLowerCase()}`;
  console.log("Cache key", cacheKey);

  try {
    const cacheData = await client.get(cacheKey);

    if (cacheData) {
      console.log("Cache hit");
      return rep.code(200).send({
        success: true,
        message: `This is the location ${location}(from cache)`,
        data: JSON.parse(cacheData),
      });
    }

    console.log("No Cache calling API");

    const response = await axios.get(
      `${process.env.WEATHER_API}${encodeURIComponent(location)}?key=${
        process.env.WEATHER_API_KEY
      }`
    );
    const data = response.data;

    const result = {
      coordinates: {
        lat: data.latitude,
        lon: data.longitude,
      },
      location: data.resolvedAddress,
      summary: data.description,
      today: {
        date: data.days[0].datetime,
        temp: data.days[0].temp,
        feelsLike: data.days[0].feelslike,
        humidity: data.days[0].humidity,
        precipitationProbability: data.days[0].precipprob,
        condition: data.days[0].conditions,
      },
    };

    await client.set(cacheKey, JSON.stringify(result), "EX", 43200);

    rep.code(200).send({
      success: true,
      message: `This is the location ${location}`,
      data: result,
    });
  } catch (err) {
    rep.code(500).send({
      success: false,
      message: "Failed to fetch weather data",
      error: err.message,
    });
  }
};

module.exports = FetchWeather;
