import api from './axios'

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