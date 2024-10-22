const { MOCK_STATUS } = require("../models/status");

const getAllInfoStatus = () => {
    return MOCK_STATUS;
};

module.exports = { getAllInfoStatus };