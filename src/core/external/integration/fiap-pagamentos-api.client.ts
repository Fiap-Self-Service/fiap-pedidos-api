const axios = require('axios');

export const fiapPagamentosApiClient = {
  gerarPagamento: async (valor) => {
    return (
      await axios.post(
        (process.env.PAGAMENTOS_ENDPOINT || 'http://fiap-pagamentos-api.com') +
          '/pagamentos',
        {
          valor,
        },
      )
    ).data;
  },
};
