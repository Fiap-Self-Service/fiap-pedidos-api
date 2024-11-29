const axios = require('axios');

export const fiapPagamentosApiClient = process.env.NODE_ENV === 'test' ? { 
  gerarPagamento: jest.fn().mockImplementation((valor) => {
    return {
      id: 'uuid'
    };
  }),
} : {
  gerarPagamento: async (valor) => {
    return await axios.post(process.env.PAGAMENTOS_ENDPOINT + '/pagamentos/', { valor }); 
  },
};