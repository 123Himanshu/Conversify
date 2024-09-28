const { Router } = require("express");
const { getAllUsers } = require("../controllers/members");
const User = require("../models/user");
const router = Router();

router.get("/getallusers", getAllUsers);

module.exports = router;
