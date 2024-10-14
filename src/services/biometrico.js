const { MOCK_BIOM } = require("../models/biometrico");

const getAllInfoBiometrico = () => {
    return MOCK_BIOM;
};

module.exports = { getAllInfoBiometrico };