const express = require("express");

const router = express.Router();

router.get("/status", (req, res) => {
  const expiryDate = new Date(process.env.APP_EXPIRY_DATE);
  const serverTime = new Date();

  const expired = serverTime > expiryDate;

  res.json({
    success: true,
    expired,
    serverTime: serverTime.toISOString(),
    expiryDate: expiryDate.toISOString(),
  });
});

module.exports = router;