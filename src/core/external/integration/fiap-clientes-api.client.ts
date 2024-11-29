const axios = require('axios');

export const fiapClientesApiClient = process.env.NODE_ENV === 'test' ? { 
  adquirirPorID: jest.fn().mockImplementation((id) => {
    
    if (id === 'cliente123') {
      return { id: 'cliente123', nome: 'Cliente Teste' };
    }

    return null;
  }),
} : {
  adquirirPorID: async (id) => {
    return await axios.get(process.env.CLIENTES_ENDPOINT + '/clientes/' + id); 
  },
};