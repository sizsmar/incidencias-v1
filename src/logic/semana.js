const res = require("express/lib/response");
const { getAllInfoBiometrico } = require("../services/biometrico");
const { getAllInfoIncidence} = require("../services/reembolso");

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

//Consulta en la BD del biometrico revisando los días que se tiene registrados
function recuperarDiasRegistrados(id, numeroSemana){
    let year = new Date().getFullYear();

    let minutoRetraso = 0;
    let foundColabRetardo = null;
    let foundcolabFalta = [];
    let cont = 0;
    let contRetardos = 0;

    //const semanaConsultada = getWeekNumber()-1;
    //const currentWeek = getWeekDays(getWeekNumber(),year);
    const pastWeek = getWeekDays(numeroSemana,year);
    const moment = require('moment');

    //console.log(`Semana ${getWeekNumber()}: ${currentWeek}`);
    console.log(`Semana ${numeroSemana}: ${pastWeek}`);
    for(let i = 0;i<7;i++){
        const auxColab = getAllInfoBiometrico().find(colaborador => colaborador["EmpleadoID"] === id && colaborador["Fecha"] === pastWeek[i]);
        if (auxColab){
            const horarioAsignado = auxColab.HorarioAsignado;
            const horaEntrada = auxColab.HoraEntrada;

            const horario = moment(horarioAsignado, 'HH:mm:ss');
            const entrada = moment(horaEntrada, 'HH:mm:ss');
            
            const diferencia = horario.diff(entrada, 'minutes');
            console.log(diferencia);
            if(diferencia < 0){
                minutoRetraso = minutoRetraso + diferencia;
                contRetardos++;
                foundColabRetardo = foundColabRetardo.concat(auxColab);
                console.log(foundColabRetardo);
            }
            foundcolabFalta = foundcolabFalta.concat(auxColab);
            cont++;

        }
    }
    return { foundColabRetardo };
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

function getAssistence(id){
    let falta = false;

    const result = recuperarDiasRegistrados(id); //Recupera la información de registros del colaborador
    const { foundColabFalta } = result; //Json

    foundColabFinal = trasnfomracionDatos(foundColabFalta);
    if(foundColabFinal == []){
        return foundColabFinal;
    }
    foundColabFinal = foundColabFinal.concat([{"falta":falta}]);

    return foundColabFinal;
}

function getPuntBonus(id){
    let bonoPuntualidad = true;

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
    return foundColabFinal;
}

function getIncidence(id){
    year = new Date().getFullYear();

    let semanaActual = getWeekNumber();
    let registroBiometrico = [];

    /*
    for(let i = semanaActual - 5; i<=semanaActual;i++){
        result = recuperarDiasRegistrados(id, i);
        registroBiometrico[i] = result;
        console.log(`Seamana recuperada: ${registroBiometrico[i]}`);
    }
    */
    const auxColab = getAllInfoIncidence().find(colaborador => colaborador["ID"] === id);
    //const result = recuperarDiasRegistrados(id);

    //const { semanaConsultada } = result;

    console.log(`Semana actual: ${semanaActual}`);
    console.log(`Registro incidencias: ${auxColab}`);

    return auxColab;
}

module.exports = { getWeekNumber, getPuntBonus, getAssistence, getIncidence};
