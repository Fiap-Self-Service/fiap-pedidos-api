import { log } from "console";

const axios = require('axios');

const mock = (id) => {
    
  if (id === 'cliente123') {
    return { id: 'cliente123', nome: 'Cliente Teste' };
  }

  return null;
};

export const fiapClientesApiClient = process.env.NODE_ENV === 'testcucumber' ? {
  adquirirPorID: mock
}: {
  adquirirPorID: async (id) => {
    return (await axios.get(process.env.CLIENTES_ENDPOINT + '/clientes/' + id)).data; 
  },
};