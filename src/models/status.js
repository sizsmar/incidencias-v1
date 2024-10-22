const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'REPORTE DE ESTATUS-GUIAS.json');
const jsonFile = fs.readFileSync(filePath, 'utf-8');
const MOCK_STATUS = JSON.parse(jsonFile);

module.exports = { MOCK_STATUS };