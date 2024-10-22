const { getPuntBonus,
        getAssistence,
        getIncidence
 } = require("../logic/semana");

const getBonusInfo = (req, res) => {
    const { id } = req.params;
    const foundColab = getPuntBonus(id);
    if(foundColab){
        res.status(200),
        res.json(foundColab);
    }else{
        res.status(400).json({ "error": 'Colaborador no encontrado' });
    }
};

const getAssistenceInfo = (req, res) => {
    const { id } = req.params;
    const foundColab = getAssistence(id);

    if(foundColab){
        res.status(200),
        res.json(foundColab);
    }else{
        res.status(400).json({ "error": "Colaborador no encontrado" });
    }
};

const getIncidenceInfo = (req, res) => {
    const { id } = req.params;
    const foundColab = getIncidence(id);
    if(foundColab){
        res.status(200),
        res.json(foundColab);
    }else{
        res.status(400).json({"error": "Colaborador no encontrado"});
    }
}

module.exports = {getBonusInfo, getAssistenceInfo, getIncidenceInfo};