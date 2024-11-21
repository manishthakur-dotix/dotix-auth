const axios = require("axios");

// Utility function to get location data from IP using ipapi.co
const getLocationFromIP = async (ipAddress) => {
  try {
    const request = await fetch(
      `https://ipinfo.io/${ipAddress}/json?token=56c6bd9df9e383`
    );
    const jsonResponse = await request.json();

    // Ensure jsonResponse contains the required properties before destructuring
    const { region, country, city } = jsonResponse || {};

    if (jsonResponse) {
      return {
        region: region || null,
        country: country || null,
        city: city || null,
      };
    }
  } catch (error) {
    console.error("Error fetching location data from IP:", error);
    return null;
  }
};

module.exports = { getLocationFromIP };
