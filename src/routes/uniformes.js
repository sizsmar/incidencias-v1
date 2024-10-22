const express = require("express");
const router = express.Router();
const {checkSession} = require('../middleware/origin');
const { getStatus } = require("../controllers/uniformes");

// http:/localhost:3001/api/uniformes/status
router.get("/status/:id", checkSession, getStatus);

module.exports = router;