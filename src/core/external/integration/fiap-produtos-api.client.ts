const axios = require('axios');

export const fiapProdutosApiClient = process.env.NODE_ENV === 'test' ? {
  buscarProdutoPorID: jest.fn().mockImplementation((idProduto) => {
    if (idProduto === 'produto1') {
      return { id: 'produto1', valor: 100 };
    }
    return null;
  }),
} : {
  buscarProdutoPorID: async (idProduto) => {
    return await axios.get(process.env.PRODUTOS_ENDPOINT + '/produtos/' + idProduto); 
  },
};