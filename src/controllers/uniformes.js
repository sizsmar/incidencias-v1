const { getAllInfoStatus} = require("../services/status");

const getStatus = (req, res) => {
    const { id } = req.params;
    const idAsNumber = parseInt(id, 10);
    const found = getAllInfoStatus().find(colaborador => colaborador["# DE EMPLEADO"] === idAsNumber);

    res.json(found);
};

module.exports = {getStatus};