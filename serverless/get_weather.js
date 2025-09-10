const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  // Validate event.body
  if (!event.body || typeof event.body !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid or missing request body" }),
    };
  }

  let params;
  try {
    params = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON format in request body" }),
    };
  }

  const { lat, lon, units } = params;
  // Validate required parameters
  if (!lat || !lon || !units) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required parameters: lat, lon, or units",
      }),
    };
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
  try {
    const weatherStream = await fetch(url);
    if (!weatherStream.ok) {
      return {
        statusCode: weatherStream.status,
        body: JSON.stringify({
          error: `Weather API request failed with status ${weatherStream.status}`,
        }),
      };
    }
    const weatherJson = await weatherStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(weatherJson),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 422,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
