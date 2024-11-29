const axios = require('axios');

const mock = (valor) => {
  return {
    id: 'uuid',
  };
};

export const fiapPagamentosApiClient =
  process.env.NODE_ENV === 'test'
    ? {
        gerarPagamento: jest.fn().mockImplementation(mock),
      }
    : process.env.NODE_ENV === 'testcucumber'
      ? {
          gerarPagamento: mock,
        }
      : {
          gerarPagamento: async (valorTotal) => {
            return await axios.post(
              process.env.PAGAMENTOS_ENDPOINT + '/pagamentos/',
              { valorTotal },
            );
          },
        };
