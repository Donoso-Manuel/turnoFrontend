import { useState } from 'react';
import api from './axios'

const [errores, setErrores] = useState([])

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