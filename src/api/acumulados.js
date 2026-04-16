import api from "./axios"

export const getAcumulados = async(params)=>{
    const res = await api.get('/beneficios/acumulados',{params})
    return res.data 
}
export const exportarAcumulados = async(params)=>{
    const res = await api.get('/beneficios/acumulados/exportar',{
        params,
        responseType: 'blob'
    });
    return res.data
}