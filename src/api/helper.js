export const construirFechas = (anio, mes) =>{
    if(!mes){
        return{
            desde: `${anio}-01-01`,
            hasta: `${anio}-12-31`
        };
    }
    const mesStr = String(mes).padStart(2,'0');

    const ultimoDia = new Date(anio, mes, 0).getDate();

    return{
        desde:`${anio}-${mesStr}-01`,
        hasta:`${anio}-${mesStr}-${ultimoDia}`
    };
};