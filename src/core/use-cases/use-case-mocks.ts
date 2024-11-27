// Mock para ClienteGateway
export const clienteGatewayMock = process.env.NODE_ENV === 'test' ? {
  adquirirPorID: jest.fn().mockImplementation((id) => {
    if (id === 'cliente123') {
      return { id: 'cliente123', nome: 'Cliente Teste' }; // Cliente encontrado
    }
    return null; // Cliente não encontrado
  }),
} : {
  adquirirPorID: (id) => {
    if (id === 'cliente123') {
      return { id: 'cliente123', nome: 'Cliente Teste' }; // Cliente encontrado
    }
    return null; // Cliente não encontrado
  },
};

// Mock para ProdutoGateway
export const produtoGatewayMock = process.env.NODE_ENV === 'test' ? {
  buscarProdutoPorID: jest.fn().mockImplementation((idProduto) => {
    if (idProduto === 'produto1') {
      return { id: 'produto1', valor: 100 }; // Produto encontrado
    }
    return null; // Produto não encontrado
  }),
} : {
  buscarProdutoPorID: (idProduto) => {
    if (idProduto === 'produto1') {
      return { id: 'produto1', valor: 100 }; // Produto encontrado
    }
    return null; // Produto não encontrado
  },
};

// Mock para PedidoGateway
export const pedidoRepositoryMock = process.env.NODE_ENV === 'test' ? {
  salvarPedido: jest.fn(),
  listarPorIdCliente: jest.fn(),
  listarPedidos: jest.fn(),
  buscarPorIdPedido: jest.fn(),
  buscarPorIdPagamento: jest.fn(),
  atualizarStatusPedido: jest.fn(),
} : {
  salvarPedido: () => {},
  listarPorIdCliente: () => {},
  listarPedidos: () => {},
  buscarPorIdPedido: () => {},
  buscarPorIdPagamento: () => {},
  atualizarStatusPedido: () => {},
};

export const pedidoCacheRepositoryMock = process.env.NODE_ENV === 'test' ? {
  adicionarPedidoCache: jest.fn(),
  removerPedidoCache: jest.fn(),
  listarPedidosAtivos: jest.fn(),
  atualizarStatusPedidoCache: jest.fn(),
} : {
  adicionarPedidoCache: () => {},
  removerPedidoCache: () => {},
  listarPedidosAtivos: () => {},
  atualizarStatusPedidoCache: () => {},
};

export const pedidoGatewayMock = process.env.NODE_ENV === 'test' ? {
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
} : {
  pedidoRepository: pedidoRepositoryMock,
  pedidoCacheRepository: pedidoCacheRepositoryMock,
  salvarPedido: () => {},
  listarPorIdCliente: () => {},
  listarPedidos: () => {},
  buscarPorIdPedido: () => {},
  buscarPorIdPagamento: () => {},
  atualizarStatusPedido: () => {},
  adicionarPedidoCache: () => {},
  removerPedidoCache: () => {},
  listarPedidosAtivos: () => {},
  atualizarStatusPedidoCache: () => {},
};

// Mock do Provider do PedidoGateway
export const pedidoGatewayProviderMock = process.env.NODE_ENV === 'test' ? {
  provide: 'PedidoGateway',
  useValue: {
    ...pedidoGatewayMock,
    pedidoRepository: pedidoGatewayMock.pedidoRepository,
    pedidoCacheRepository: pedidoGatewayMock.pedidoCacheRepository,
  },
} : {
  provide: 'PedidoGateway',
  useValue: {
    ...pedidoGatewayMock,
    pedidoRepository: pedidoGatewayMock.pedidoRepository,
    pedidoCacheRepository: pedidoGatewayMock.pedidoCacheRepository,
  },
};

// Mock para CadastrarIntencaoPagamentoUseCase
export const cadastrarIntencaoPagamentoUseCaseMock = process.env.NODE_ENV === 'test' ? {
  execute: jest.fn().mockResolvedValue({
    id: { toHexString: () => 'intencaoPagamento123' },
  }), // Simula o retorno da intenção de pagamento
} : {
  execute: () => ({ id: { toHexString: () => 'intencaoPagamento123' } }),
};

// Mock para IntencaoPagamentoGateway (se necessário)
export const intencaoPagamentoGatewayMock = process.env.NODE_ENV === 'test' ? {
  // Mockar os métodos necessários aqui
} : {};

// Mock para IPagamentoClient (se necessário)
export const pagamentoClientMock = process.env.NODE_ENV === 'test' ? {
  // Mockar os métodos necessários aqui
} : {};
