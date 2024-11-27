export const mockIntencaoPagamentoGateway = {
    criarIntencaoPagamento: jest.fn().mockResolvedValue({
      id: 'intencao123',
      status: 'PENDENTE',
      valor: 100.0,
    }),
  };
  
  export const mockCadastrarIntencaoPagamentoUseCase = {
    execute: jest.fn().mockResolvedValue({
      id: 'intencao123',
      status: 'APROVADO',
    }),
  };
  
  export const mockPagamentoClient = {
    criarPagamento: jest.fn().mockResolvedValue({
      id: 'pagamento123',
      status: 'CONFIRMADO',
    }),
    verificarStatusPagamento: jest.fn().mockResolvedValue({
      id: 'pagamento123',
      status: 'CONFIRMADO',
    }),
  };
  
  export const mockClienteGateway = {
    obterCliente: jest.fn().mockImplementation(async (idCliente: string) => {
      if (idCliente === 'cliente123') {
        return {
          id: 'cliente123',
          nome: 'Cliente Teste',
          email: 'cliente@teste.com',
        };
      } else {
        throw new Error('Cliente não encontrado');
      }
    }),
  };
  
  export const mockProdutoGateway = {
    obterProdutos: jest.fn().mockImplementation(async (idsProdutos: string[]) => {
      return idsProdutos.map((idProduto) => ({
        id: idProduto,
        nome: `Produto ${idProduto}`,
        preco: 50.0,
        estoque: 10,
      }));
    }),
  };
  
  export const mockPedidoGateway = {
    salvarPedido: jest.fn().mockResolvedValue({
      id: 'pedido123',
      idCliente: 'cliente123',
      status: 'PENDENTE',
      combo: [
        { idProduto: 'produto123', quantidade: 2, valor: 50.0 },
      ],
      valorTotal: 100.0,
    }),
    buscarPedidoPorId: jest.fn().mockImplementation(async (idPedido: string) => {
      if (idPedido === 'pedido123') {
        return {
          id: 'pedido123',
          idCliente: 'cliente123',
          status: 'PENDENTE',
          combo: [
            { idProduto: 'produto123', quantidade: 2, valor: 50.0 },
          ],
          valorTotal: 100.0,
        };
      } else {
        throw new Error('Pedido não encontrado');
      }
    }),
  };
  