const axios = require('axios');

export const fiapProdutosApiClient = {
  buscarProdutoPorID: async (idProduto) => {
    return (
      await axios.get(
        (process.env.PRODUTOS_ENDPOINT || 'http://fiap-produtos-api.com') +
          '/produtos/' +
          idProduto,
      )
    ).data;
  },
};
