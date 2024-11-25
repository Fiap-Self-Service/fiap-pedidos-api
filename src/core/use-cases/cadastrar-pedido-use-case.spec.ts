import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarPedidoUseCase } from './cadastrar-pedido-use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { clienteGatewayMock, produtoGatewayMock, intencaoPagamentoGatewayMock, cadastrarIntencaoPagamentoUseCaseMock, pagamentoClientMock } from './use-case-mocks';

describe('CadastrarPedidoUseCase', () => {
  let cadastrarPedidoUseCase: CadastrarPedidoUseCase;
  let pedidoGateway: PedidoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarPedidoUseCase,
        PedidoGateway,
        {
          provide: 'ClienteGateway',
          useValue: clienteGatewayMock,
        },
        {
          provide: 'ProdutoGateway',
          useValue: produtoGatewayMock,
        },
        {
          provide: 'IntencaoPagamentoGateway',
          useValue: intencaoPagamentoGatewayMock,
        },
        {
          provide: 'CadastrarIntencaoPagamentoUseCase',
          useValue: cadastrarIntencaoPagamentoUseCaseMock,
        },
        {
          provide: 'PagamentoClient',
          useValue: pagamentoClientMock,
        },
      ],
    }).compile();

    cadastrarPedidoUseCase = module.get<CadastrarPedidoUseCase>(CadastrarPedidoUseCase);
    pedidoGateway = module.get<PedidoGateway>(PedidoGateway);
  });

  describe('execute', () => {
    it('Deve lançar uma exceção se o cliente não for encontrado', async () => {
      const pedido = new Pedido('cliente123', [], 'intencaoPagamento123');
      clienteGatewayMock.adquirirPorID.mockResolvedValue(null); // Cliente não encontrado

      await expect(cadastrarPedidoUseCase.execute(
        clienteGatewayMock,
        produtoGatewayMock,
        intencaoPagamentoGatewayMock,
        pagamentoClientMock,
        cadastrarIntencaoPagamentoUseCaseMock,
        pedidoGateway,
        pedido
      )).rejects.toThrowError(new HttpException('Cliente não encontrado.', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar uma exceção se o combo de produtos estiver vazio', async () => {
      const pedido = new Pedido('cliente123', [], 'intencaoPagamento123');
      await expect(cadastrarPedidoUseCase.execute(
        clienteGatewayMock,
        produtoGatewayMock,
        intencaoPagamentoGatewayMock,
        pagamentoClientMock,
        cadastrarIntencaoPagamentoUseCaseMock,
        pedidoGateway,
        pedido
      )).rejects.toThrowError(new HttpException('Combo de produtos não pode estar vazio', HttpStatus.BAD_REQUEST));
    });

    it('Deve salvar o pedido e adicionar ao cache', async () => {
      const pedido = new Pedido('cliente123', [
        { idProduto: 'produto1', quantidade: 2, valor: 100 } as ItemPedido
      ], 'intencaoPagamento123');
      clienteGatewayMock.adquirirPorID.mockResolvedValue({ id: 'cliente123' }); // Cliente válido

      // Mockando a resposta do produto
      produtoGatewayMock.buscarProdutoPorID.mockResolvedValue({ id: 'produto1', valor: 100 });

      // Mock de sucesso para o método de intenção de pagamento
      cadastrarIntencaoPagamentoUseCaseMock.execute.mockResolvedValue({ id: 'intencaoPagamento123' });

      const resultado = await cadastrarPedidoUseCase.execute(
        clienteGatewayMock,
        produtoGatewayMock,
        intencaoPagamentoGatewayMock,
        pagamentoClientMock,
        cadastrarIntencaoPagamentoUseCaseMock,
        pedidoGateway,
        pedido
      );

      expect(pedidoGateway.salvarPedido).toHaveBeenCalled();
      expect(pedidoGateway.adicionarPedidoCache).toHaveBeenCalled();
      expect(resultado).toEqual({ /* Mock do resultado do pedido salvo */ });
    });
  });
});
