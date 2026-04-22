import api from "./axios"

export const getKPIs = async(params) =>{
    const res =  await api.get('/dashboard/kpis',{params});
    return res.data
}