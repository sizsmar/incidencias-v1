const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'resultadoReembolsos.json');
const jsonFile = fs.readFileSync(filePath, 'utf-8');
const MOCK_REEM = JSON.parse(jsonFile);

module.exports = { MOCK_REEM };