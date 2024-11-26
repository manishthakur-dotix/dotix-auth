// Main utility function to get location data without specifying a service
const getLocationData = async (ipAddress) => {
  try {
    // First attempt: Get location from ipinfo
    let location = await getLocationFromIPInfo(ipAddress);
    if (location) return location;

    // If both services fail, return null
    console.error("Unable to fetch location data from available services.");
    return null;
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
};

// Child function for getting location data from ipinfo.io
const getLocationFromIPInfo = async (ipAddress) => {
  try {
    const response = await fetch(
      `https://ipinfo.io/${ipAddress}/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`
    );
    const data = await response.json();

    // Extract and return location details
    const { city, region, country, postal } = data || {};

    return {
      city: city || null,
      pinCode: postal || null,
      region: region || null,
      country: country || null,
    };

    return null;
  } catch (error) {
    console.error("Error fetching data from ipinfo:", error);
    return null;
  }
};

module.exports = {
  getLocationData,
  getLocationFromIPInfo,
};
