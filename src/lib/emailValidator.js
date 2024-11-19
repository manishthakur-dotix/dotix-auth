const dns = require("dns/promises"); // Use the promise-based DNS module

// Regular expression to validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailFormat = (email) => {
  return emailRegex.test(email);
};

const checkEmailMXRecords = async (email) => {
  const domain = email.split("@")[1];

  try {
    const addresses = await dns.resolveMx(domain); // Await the MX records

    // If there are MX records, the email domain is valid
    if (addresses && addresses.length > 0) {
      console.log(`MX records for ${domain}:`, addresses);
      return true;
    } else {
      console.log(`No MX records found for domain ${domain}.`);
      return false;
    }
  } catch (err) {
    console.error(`Failed to resolve MX records for domain ${domain}:`, err);
    return false;
  }
};

// Export the utility functions
module.exports = { validateEmailFormat, checkEmailMXRecords };
