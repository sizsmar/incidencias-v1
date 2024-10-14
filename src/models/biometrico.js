const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'resultadoBiometrico.json');
const jsonFile = fs.readFileSync(filePath, 'utf-8');
const MOCK_BIOM = JSON.parse(jsonFile);

module.exports = { MOCK_BIOM };