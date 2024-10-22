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
    return {"semana": numeroSemana, registros: result};
}
//Consulta en la BD del biometrico revisando los días que se tiene registrados
function recuperarDiasRegistrados(id, numeroSemana){
    let arrayRegistrosColab = [];
    for(let i = numeroSemana-5;i<numeroSemana;i++){
        arrayRegistrosColab =  arrayRegistrosColab.concat(busquedaBiometrico(id, i)); //recupera todos los registros de la semana i, i = numeroSemana
    }
    return { arrayRegistrosColab };
}

function calculateAssistence(id){
    let year = new Date().getFullYear();
    let semanaActual = getWeekNumber();
    const result = recuperarDiasRegistrados(id, semanaActual); //Recupera los registros del colaborador clasificandolo por semana.
    const arrayFaltas = {
        "data": []
    }
    result.arrayRegistrosColab.forEach(semana => {
        const weekDays = getWeekDays(semana.semana, year); //Semana ideal
        const registros = semana.registros || [];

        const semanaFaltas = {
            "semana": semana.semana,
            "falta" : false,
            "registros": []
        };
     
        for(let i = 0 ; i < weekDays.length - 1; i++){                                          // Se compara la semana ideal de Lunes a Sabado con la semana registrada del colaborador
            const found = registros.find(colaborador => colaborador["Fecha"] === weekDays[i]);
            if(!found){                                                                         // En caso de no encontrar coincidencia en un día, se registra como falta
                semanaFaltas.registros.push(weekDays[i]);
            }
        }
        
        if(semanaFaltas.registros.length > 0){      //Si campo 'Registros' del objeto semanaFaltas no esta vacio, se agrega a arrayFaltas
            semanaFaltas.falta = true;
            arrayFaltas.data.push(semanaFaltas);
        }else arrayFaltas.data.push(semanaFaltas);
    });
    return arrayFaltas;
}

function calculatePuntBonus(id){
    const registrosRetardos = {
        "data": []
    }

    let aux = 0;
    let year = new Date().getFullYear();
    let semanaActual = getWeekNumber();
    
    const result = recuperarDiasRegistrados(id, semanaActual); //Recupera los registros del colaborador clasificandolo por semana.
    
    result.arrayRegistrosColab.forEach(semana => {
        const semanaFaltas = {
            "semana": semana.semana,                // Se le asigna el valor de la semana del calculo
            "retardo": false,
            "sumaDeMinutos": 0,
            "registros": []
        };
        
        const registros = semana.registros || [];
        
        for(let i = 0 ; i < registros.length ;i++){
            let diferenciaMinutos = calcularDiferenciaHorarios(registros[i].HorarioAsignado, registros[i].HoraEntrada);
            if(diferenciaMinutos<0){
                semanaFaltas.sumaDeMinutos += diferenciaMinutos;
                if(Math.abs(semanaFaltas.sumaDeMinutos) >= 10) semanaFaltas.retardo = true;
                diferenciaMinutos = registros[i].Fecha + ":"  + diferenciaMinutos;
                semanaFaltas.registros.push(diferenciaMinutos);
            }
        }
        registrosRetardos.data.push(semanaFaltas);
        aux++;
    });
    return registrosRetardos;
}

function calcularDiferenciaHorarios(horarioAsignado, horarioEntrada){
    function convertirHorasMinutos(hora){
        const partes = hora.split(':');
        const horas = parseInt(partes[0], 10) * 60;
        const minutos = parseInt(partes[1], 10);
        
        return horas + minutos;
    }
    
    const minutosHorarioAsignado = convertirHorasMinutos(horarioAsignado);
    const minutosHoraEntrada = convertirHorasMinutos(horarioEntrada);

    const diferenciaMinutos = minutosHorarioAsignado - minutosHoraEntrada;

    return diferenciaMinutos;
}

function calculateIncidence(id){
    const result = getAllInfoIncidence().find(colaborador => colaborador["ID"] === id);

    const incidencias = {
        "incidencia": false,
        "data": []
    }

    if(result){
        incidencias.incidencia = true;
        incidencias.data.push(result);
    }
    return {result};
}

function getAssistence(id){
    let result = null;
    if(getAllInfoBiometrico().find(colaboardor => colaboardor["EmpleadoID"] === id)){
        result = calculateAssistence(id);
    }
    return result;
}

function getPuntBonus(id){
    let result = null;
    if(getAllInfoBiometrico().find(colaboardor => colaboardor["EmpleadoID"] === id)){
        result = calculatePuntBonus(id);
    }
    return result;
}

function getIncidence(id){
    let result = null;
    if(getAllInfoIncidence().find(colaboardor => colaboardor["ID"] === id)){
        result = calculateIncidence(id);
    }
    return result;
}

module.exports = { getWeekNumber, getPuntBonus, getAssistence, getIncidence};