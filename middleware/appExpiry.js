const APP_EXPIRY_DATE = new Date(process.env.APP_EXPIRY_DATE);

const checkAppExpiry = (req, res, next) => {
  const now = new Date();

  if (now > APP_EXPIRY_DATE) {
    return res.status(403).json({
      success: false,
      expired: true,
      message: "This application has expired.",
      expiryDate: APP_EXPIRY_DATE.toISOString(),
      serverTime: now.toISOString(),
    });
  }

  next();
};

module.exports = checkAppExpiry;