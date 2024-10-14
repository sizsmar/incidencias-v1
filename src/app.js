require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const {router} = require('./routes');

app.use(cors());
app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Funcionando...', PORT));