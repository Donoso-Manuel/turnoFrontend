import api from './axios'

export const getBeneficios = (params) => {
  return api.get('/beneficios/beneficios', { params });
};

// 💰 pagar + exportar
export const exportarYPagar = (ids) => {
    console.log(ids)
  return api.post('/beneficios/exportar-pagar', { ids }, {
    responseType: 'blob'
  });
};