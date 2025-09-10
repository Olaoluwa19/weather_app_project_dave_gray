export const setLocationObject = (locationObj, coordsObj) => {
  const { lat, lon, name, unit } = coordsObj;
  locationObj.setLat(lat);
  locationObj.setLon(lon);
  locationObj.setName(name);
  if (unit) locationObj.setUnit(unit);
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

// export const getWeatherFromCoords = async (locationObj) => {
//   const urlDataObj = {
//     lat: locationObj.getLat(),
//     lon: locationObj.getLon(),
//     units: locationObj.getUnit(),
//   };
//   try {
//     const weatherStream = await fetch("./.netlify/functions/get_weather", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(urlDataObj),
//     });
//     const weatherJson = await weatherStream.json();
//     return weatherJson;
//   } catch (err) {
//     console.error(err);
//   }
// };


export const getWeatherFromCoords = async (locationObj) => {
  const urlDataObj = {
    lat: locationObj.getLat(),
    lon: locationObj.getLon(),
    units: locationObj.getUnit(),
  };

  // Validate urlDataObj
  if (!urlDataObj.lat || !urlDataObj.lon || !urlDataObj.units) {
    console.error("Invalid location data:", urlDataObj);
    throw new Error("Missing required location parameters: lat, lon, or units");
  }

  try {
    const weatherStream = await fetch("./.netlify/functions/get_weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(urlDataObj),
    });

    if (!weatherStream.ok) {
      throw new Error(`HTTP error! Status: ${weatherStream.status}`);
    }

    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.error("Error fetching weather:", err);
    throw err; // Re-throw to allow calling code to handle the error
  }
};

export const getCoordsFromApi = async (entryText, units) => {
  const urlDataObj = {
    text: entryText,
    units: units,
  };

  try {
    const dataStream = await fetch("./.netlify/functions/get_coords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(urlDataObj),
    });
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.error(err);
  }
};

export const cleanText = (text) => {
  const regex = / {2,}/g;
  const entryText = text.replace(regex, " ").trim();
  return entryText;
};
