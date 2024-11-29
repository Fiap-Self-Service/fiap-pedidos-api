const axios = require('axios');

const mock = (idProduto) => {
  if (idProduto === 'produto1') {
    return { id: 'produto1', valor: 100 };
  }
  return null;
};

export const fiapProdutosApiClient = process.env.NODE_ENV === 'testcucumber' ? {
  buscarProdutoPorID: mock
}: {
  buscarProdutoPorID: async (idProduto) => {
    return (await axios.get(process.env.PRODUTOS_ENDPOINT + '/produtos/' + idProduto)).data; 
  },
};