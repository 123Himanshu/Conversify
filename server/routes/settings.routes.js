const express = require("express");
const router = express.Router();
const { handleSettings } = require("../controllers/settings");

router.post("/", handleSettings);

module.exports = router;
