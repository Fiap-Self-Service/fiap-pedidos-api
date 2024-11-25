import { Pedido } from "../entities/pedido";

// Mock para ClienteGateway
export const clienteGatewayMock = {
  adquirirPorID: jest.fn().mockImplementation((id: string) => {
    if (id === 'cliente123') {
      return { id: 'cliente123', nome: 'Cliente Teste' }; // Cliente encontrado
    }
    return null; // Cliente não encontrado
  }),
};

// Mock para ProdutoGateway
export const produtoGatewayMock = {
  buscarProdutoPorID: jest.fn().mockImplementation((idProduto: string) => {
    if (idProduto === 'produto1') {
      return { id: 'produto1', valor: 100 }; // Produto encontrado
    }
    return null; // Produto não encontrado
  }),
};

// Mock para PedidoGateway
export const pedidoRepositoryMock = {
    salvarPedido: jest.fn(),
    listarPorIdCliente: jest.fn(),
    listarPedidos: jest.fn(),
    buscarPorIdPedido: jest.fn(),
    buscarPorIdPagamento: jest.fn(),
    atualizarStatusPedido: jest.fn(),
  };
  
  export const pedidoCacheRepositoryMock = {
    adicionarPedidoCache: jest.fn(),
    removerPedidoCache: jest.fn(),
    listarPedidosAtivos: jest.fn(),
    atualizarStatusPedidoCache: jest.fn(),
  };
  
  export const pedidoGatewayMock = {
    pedidoRepository: pedidoRepositoryMock,
    pedidoCacheRepository: pedidoCacheRepositoryMock,
    salvarPedido: jest.fn(),
    listarPorIdCliente: jest.fn(),
    listarPedidos: jest.fn(),
    buscarPorIdPedido: jest.fn(),
    buscarPorIdPagamento: jest.fn(),
    atualizarStatusPedido: jest.fn(),
    adicionarPedidoCache: jest.fn(),
    removerPedidoCache: jest.fn(),
    listarPedidosAtivos: jest.fn(),
    atualizarStatusPedidoCache: jest.fn(),
  };
  
  // Mock do Provider do PedidoGateway
  export const pedidoGatewayProviderMock = {
    provide: 'PedidoGateway',
    useValue: {
      ...pedidoGatewayMock,
      // Mock do construtor que requer as dependências
      pedidoRepository: pedidoGatewayMock.pedidoRepository,
      pedidoCacheRepository: pedidoGatewayMock.pedidoCacheRepository,
    },
  };

// Mock para CadastrarIntencaoPagamentoUseCase
export const cadastrarIntencaoPagamentoUseCaseMock = {
  execute: jest.fn().mockResolvedValue({
    id: { toHexString: () => 'intencaoPagamento123' },
  }), // Simula o retorno da intenção de pagamento
};

// Mock para IntencaoPagamentoGateway (se necessário)
export const intencaoPagamentoGatewayMock = {
  // Mockar os métodos necessários aqui
};

// Mock para IPagamentoClient (se necessário)
export const pagamentoClientMock = {
  // Mockar os métodos necessários aqui
};