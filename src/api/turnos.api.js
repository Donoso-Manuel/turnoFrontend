import { useState } from 'react';
import api from './axios';
import * as XLSX from 'xlsx'

//const [errores, setErrores] = useState([])

export async function subirExcel(file, forzar =  false) {
    const formData =  new FormData();
    formData.append('file', file);
    formData.append('forzar', forzar);

    try{
        const response = await api.post('/turnos/cargar-excel', formData);

        return response.data;
    }catch(error){
        throw error.response?.data || {error: "Error al subir el Archivo"}
    }
}
export const crearTurnoManual = async (data) =>{
    const res = await api.post('/turnos/manual', data);
    return res.data;
}
export function validarRut(rutCompleto) {
  if (!rutCompleto) return false;

  const rut = rutCompleto.replace(/\./g, '').replace('-', '');
  
  if (rut.length < 2) return false;

  const cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i]);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);

  let dvFinal = '';
  if (dvEsperado === 11) dvFinal = '0';
  else if (dvEsperado === 10) dvFinal = 'K';
  else dvFinal = String(dvEsperado);

  return dv === dvFinal;
}
export function formatearFecha(fecha){
    if(!fecha) return '';

    const f = new Date(fecha);
    return f.toLocaleDateString('es-CL');
}
export function descargarErroresExcel(errores){
    if(!errores || errores.length === 0) return;

    const data = errores.map(e =>({
        RUT: e.rut,
        NOMBRE: e.nombre,
        FECHA: formatearFecha(e.fecha),
        CODIGO_TURNO: e.codigoTurno,
        HORA_INGRESO: e.horaIngreso,
        HORA_SALIDA: e.horaSalida,
        MOTIVO: e.motivo
    }))
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb,ws,'Errores')

    XLSX.writeFile(wb, `errores_carga_${Date.now()}.xlsx`)
}