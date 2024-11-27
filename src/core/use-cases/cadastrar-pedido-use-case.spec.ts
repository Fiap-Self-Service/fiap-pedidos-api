import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarPedidoUseCase } from './cadastrar-pedido-use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { IPedidoRepository } from '../external/repository/pedido-repository.interface';
import { IPedidoCacheRepository } from '../external/repository/pedido-cache-repository.interface';
import {
  clienteGatewayMock,
  produtoGatewayMock,
  intencaoPagamentoGatewayMock,
  cadastrarIntencaoPagamentoUseCaseMock,
  pagamentoClientMock,
} from './use-case-mocks';

jest.mock('../adapters/gateways/pedido-gateway');

describe('CadastrarPedidoUseCase', () => {
  let cadastrarPedidoUseCase: CadastrarPedidoUseCase;
  let pedidoGateway: jest.Mocked<PedidoGateway>;
  let pedidoRepositoryMock: jest.Mock;
  let pedidoCacheRepositoryMock: jest.Mock;

  beforeEach(async () => {
    pedidoRepositoryMock = jest.fn();
    pedidoCacheRepositoryMock = jest.fn();

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
        {
          provide: IPedidoRepository,
          useValue: pedidoRepositoryMock,
        },
        {
          provide: IPedidoCacheRepository,
          useValue: pedidoCacheRepositoryMock,
        },
      ],
    }).compile();

    cadastrarPedidoUseCase = module.get<CadastrarPedidoUseCase>(CadastrarPedidoUseCase);

    // Configura o mock para PedidoGateway
    pedidoGateway = module.get<PedidoGateway>(PedidoGateway) as jest.Mocked<PedidoGateway>;

    // Mock explícito dos métodos de PedidoGateway
    pedidoGateway.salvarPedido = jest.fn();
    pedidoGateway.adicionarPedidoCache = jest.fn();
  });

  describe('execute', () => {
    it('Deve lançar uma exceção se o cliente não for encontrado', async () => {
      const pedido = new Pedido('cliente123', [
        { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
      ], 'intencaoPagamento123');

      (clienteGatewayMock.adquirirPorID as jest.Mock).mockResolvedValue(null);

      await expect(cadastrarPedidoUseCase.execute(pedido, pedidoGateway)).rejects.toThrowError(
        new HttpException('Cliente não encontrado.', HttpStatus.BAD_REQUEST),
      );
    });

    it('Deve lançar uma exceção se o combo de produtos estiver vazio', async () => {
      const pedido = {
        id: 'pedido123',
        idCliente: 'cliente123',
        combo: [],
        idIntencaoPagamento: 'intencaoPagamento123',
        idPagamento: null,
        valorTotal: 0,
        dataCriacao: new Date(),
        status: 'PENDENTE',
      } as unknown as Pedido;

      await expect(cadastrarPedidoUseCase.execute(pedido, pedidoGateway)).rejects.toThrowError(
        new HttpException('Combo de produtos não pode estar vazio', HttpStatus.BAD_REQUEST),
      );
    });

    it('Deve lançar uma exceção se algum produto do combo não for encontrado', async () => {
      const pedido = new Pedido('cliente123', [{ idProduto: 'produto1', quantidade: 2, valor: 100 } as ItemPedido], 'intencaoPagamento123');

      (clienteGatewayMock.adquirirPorID as jest.Mock).mockResolvedValue({ id: 'cliente123' });
      (produtoGatewayMock.buscarProdutoPorID as jest.Mock).mockResolvedValue(null);

      await expect(cadastrarPedidoUseCase.execute(pedido, pedidoGateway)).rejects.toThrowError(
        new HttpException('Ops... o produto produto1 não foi encontrado.', HttpStatus.BAD_REQUEST),
      );
    });

    it('Deve lançar uma exceção se falhar ao criar a intenção de pagamento', async () => {
      const pedido = new Pedido('cliente123', [{ idProduto: 'produto1', quantidade: 2, valor: 100 } as ItemPedido], 'intencaoPagamento123');

      (clienteGatewayMock.adquirirPorID as jest.Mock).mockResolvedValue({ id: 'cliente123' });
      (produtoGatewayMock.buscarProdutoPorID as jest.Mock).mockResolvedValue({ id: 'produto1', valor: 100 });
      (cadastrarIntencaoPagamentoUseCaseMock.execute as jest.Mock).mockRejectedValue(
        new Error('Falha ao criar intenção de pagamento'),
      );

      await expect(cadastrarPedidoUseCase.execute(pedido, pedidoGateway)).rejects.toThrowError(
        new HttpException('Falha ao criar intenção de pagamento', HttpStatus.BAD_REQUEST),
      );
    });

    it('Deve salvar o pedido e adicionar ao cache com sucesso', async () => {
      const pedido = new Pedido('cliente123', [{ idProduto: 'produto1', quantidade: 2, valor: 100 } as ItemPedido], 'intencaoPagamento123');

      (clienteGatewayMock.adquirirPorID as jest.Mock).mockResolvedValue({ id: 'cliente123' });
      (produtoGatewayMock.buscarProdutoPorID as jest.Mock).mockResolvedValue({ id: 'produto1', valor: 100 });
      (cadastrarIntencaoPagamentoUseCaseMock.execute as jest.Mock).mockResolvedValue({
        id: { toHexString: jest.fn().mockReturnValue('intencaoPagamento123') },
      });

      const pedidoSalvoMock = new Pedido('cliente123', [{ idProduto: 'produto1', quantidade: 2, valor: 100 } as ItemPedido], 'intencaoPagamento123');

      (pedidoGateway.salvarPedido as jest.Mock).mockResolvedValue(pedidoSalvoMock);
      (pedidoGateway.adicionarPedidoCache as jest.Mock).mockResolvedValue(undefined);

      const resultado = await cadastrarPedidoUseCase.execute(pedido, pedidoGateway);

      expect(pedidoGateway.salvarPedido).toHaveBeenCalled();
      expect(pedidoGateway.adicionarPedidoCache).toHaveBeenCalled();
      expect(resultado).toEqual(pedidoSalvoMock);
    });
  });
});
