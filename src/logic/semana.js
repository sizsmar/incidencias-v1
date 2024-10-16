const res = require("express/lib/response");
const { getAllInfoBiometrico } = require("../services/biometrico");
const { getAllInfoIncidence } = require("../services/reembolso");
const { weekdays } = require("moment");

function getWeekNumber(){
    const currentDate = new Date();
    const tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const dayOfYear = ((tempDate - new Date(tempDate.getFullYear(), 0, 1)) / 86400000) + 1;
    weekNumber = Math.ceil(dayOfYear / 7);

    return weekNumber;
}

function getWeekDays(week, year){
    const firstDayYear = new Date(year, 0, 1);
    const weekDay = firstDayYear.getDay();

    const daysToMonday = (weekDay <= 1 ? 1 - weekDay : 8 - weekDay) + (week - 1) * 7;
    const mondayWeek = new Date(firstDayYear.setDate(firstDayYear.getDate() + daysToMonday));

    const daysOfTheWeek = [];

    for (let i = 0;i < 7;i++){
        let day = new Date(mondayWeek);
        day.setDate(mondayWeek.getDate() + i);

        const formatedDay = `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}/${day.getFullYear()}`;
        daysOfTheWeek.push(formatedDay);
    }
    return daysOfTheWeek;
}

function busquedaBiometrico(id, numeroSemana){
    let year = new Date().getFullYear();
    const weekDays = getWeekDays(numeroSemana,year);
    let result = [];
    for(let i=0;i<weekDays.length;i++){
        const found = getAllInfoBiometrico().find(colaborador => colaborador["EmpleadoID"] === id && colaborador["Fecha"] === weekDays[i]);
        if(found){
            result.push(found);
        }
    }
    //console.log(result);
    return {"Semana": numeroSemana, registros: result};
}
//Consulta en la BD del biometrico revisando los días que se tiene registrados
function recuperarDiasRegistrados(id, numeroSemana){
    let arrayRegistrosColab = [];
    for(let i = numeroSemana-5;i<numeroSemana;i++){
        arrayRegistrosColab =  arrayRegistrosColab.concat(busquedaBiometrico(id, i)); //recupera todos los registros de la semana i, i = numeroSemana
    }
    return { arrayRegistrosColab };
}

function trasnfomracionDatos(foundColab){
    if (!Array.isArray(foundColab)){
        console.error("El valor recuperado no es un array [transformacionDatos]: ", foundColab);
        return [];
    }
    const foundColabFinal = foundColab.map(({ EmpleadoID, Nombre, Fecha, HorarioAsignado, HoraEntrada}) => ({
        EmpleadoID,
        Nombre, 
        Fecha, 
        HorarioAsignado, 
        HoraEntrada
    }));

    return foundColabFinal;
}

function calculateAssistence(id){
    let year = new Date().getFullYear();
    let semanaActual = getWeekNumber();
    const result = recuperarDiasRegistrados(id, semanaActual); //Recupera los registros del colaborador clasificandolo por semana.

    result.arrayRegistrosColab.forEach(semana => {
        const weekDays = getWeekDays(semana.Semana, year); //Semana ideal
        

    });
    return result;
}

function getAssistence(id){
    let falta = false;
    const result = calculateAssistence(id);

    return result;
}

function getPuntBonus(id){
    let bonoPuntualidad = true;
    let semanaActual = getWeekNumber();
    recuperarDiasRegistrados(id, semanaActual);
    /*
    const result = recuperarDiasRegistrados(id); //Recupera la información de registros del colaborador
    const { foundColabRetardo } = result; //Json
    const { minutoRetraso } = result; //Suma de minutos de retraso
    const { cont } = result; //Numero de dias registrados
    const { contRetardos } = result; //Numero de dias registrados con retardo
    const { semanaConsultada } = result; //Semana consultada

    //Verifica si los minutos acumulados superan los 10 minutos
    if(minutoRetraso < -10 && cont != 6){
        bonoPuntualidad = false; //Si lo supera o los dias registrados no son 6 el bono de puntualidad no se aplica
    }

    //Recupera solo los datos que necesitamos
    foundColabFinal = trasnfomracionDatos(foundColabRetardo);
    foundColabFinal = foundColabFinal.concat([{"bonoPuntualidad": bonoPuntualidad, "Semana consultada": semanaConsultada, "Dias registrados con retardo":contRetardos, "Minutos de retardo acumulado": minutoRetraso}]);

    console.log(bonoPuntualidad);
    console.log(`Minutos con retraso mental: ${minutoRetraso}`);
    console.log(`Dias registrados con retardo: ${contRetardos}`);
    console.log(`Dias registrados: ${cont}`);
    */
    return {"data": 1};
}

function getIncidence(id){
    year = new Date().getFullYear();

    let semanaActual = getWeekNumber();
    const result = getAllInfoIncidence().find(colaborador => colaborador["ID"] === id);
    console.log("Resultado: ", result);

    return {result};
}

module.exports = { getWeekNumber, getPuntBonus, getAssistence, getIncidence};