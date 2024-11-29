const axios = require('axios');

export const fiapClientesApiClient = {
  adquirirPorID: async (id) => {
    return (
      await axios.get(
        (process.env.CLIENTES_ENDPOINT || 'http://fiap-clientes-api.com') +
          '/clientes/' +
          id,
      )
    ).data;
  },
};
