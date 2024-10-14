const express = require("express");
const router = express.Router();
const {checkSession} = require('../middleware/origin')

const {
    getBonusInfo,
    getAssistenceInfo,
    getIncidenceInfo
} = require("../controllers/reembolso")

// http:/localhost:3001/api/reembolso/bonus/{id}
router.get("/bonus/:id", checkSession, getBonusInfo);

// http:/localhost:3001/api/reembolso/assistence/{id}
router.get("/assistence/:id", checkSession, getAssistenceInfo);

// http:localhost:3001/api/reembolso/incidence/{id}
router .get("/incidence/:id", checkSession, getIncidenceInfo);

module.exports = router;