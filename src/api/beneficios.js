import api from './axios'

export const getBeneficios = (params) => {
  return api.get('/beneficios/beneficios', { params });
};

// 💰 pagar + exportar
export const exportarYPagar = (ids) => {

  return api.post('/beneficios/exportar-pagar', { ids }, {
    responseType: 'blob'
  });
};
export const exportar = async(lote)=>{
  try{
    const response = await api.get(`/beneficios/lotes/${lote}`,
      {responseType: 'blob'}
    );

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href= url;
    link.setAttribute('download',`lote_${lote}.xlsx`);

    document.body.appendChild(link);
    link.click();
  }catch(error){
    console.error(error)
    alert('Error al exportar')
  }
}