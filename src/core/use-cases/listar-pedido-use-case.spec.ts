import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidoUseCase } from '../use-cases/listar-pedido-use-case';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';
import { IPedidoRepository } from '../external/repository/pedido-repository.interface';
import { IPedidoCacheRepository } from '../external/repository/pedido-cache-repository.interface';

jest.mock('../adapters/gateways/pedido-gateway');

describe('ListarPedidoUseCase', () => {
  let listarPedidoUseCase: ListarPedidoUseCase;
  let pedidoGateway: jest.Mocked<PedidoGateway>;
  let pedidoRepositoryMock: jest.Mock;
  let pedidoCacheRepositoryMock: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidoUseCase,
        PedidoGateway,
        {
          provide: IPedidoRepository, // Mock do IPedidoRepository
          useValue: pedidoRepositoryMock,
        },
        {
          provide: IPedidoCacheRepository, // Mock do IPedidoCacheRepository
          useValue: pedidoCacheRepositoryMock,
        },
      ],
    }).compile();

    listarPedidoUseCase = module.get<ListarPedidoUseCase>(ListarPedidoUseCase);
    pedidoGateway = module.get<jest.Mocked<PedidoGateway>>(PedidoGateway);
  });

  describe('execute', () => {
    it('Deve retornar uma lista de pedidos', async () => {
      const itemPedido1 = new ItemPedido('pedido123', 'produto1', 2, 100);
      const itemPedido2 = new ItemPedido('pedido456', 'produto2', 1, 50);

      const pedidos = [
        new Pedido('cliente123', [itemPedido1], 'intencaoPagamento123'),
        new Pedido('cliente456', [itemPedido2], 'intencaoPagamento456'),
      ];

      (pedidoGateway.listarPedidos as jest.Mock).mockResolvedValue(pedidos); // Simulando pedidos

      const resultado = await listarPedidoUseCase.execute(pedidoGateway);

      expect(resultado).toEqual(pedidos); // Verificando se os pedidos foram retornados corretamente
      expect(pedidoGateway.listarPedidos).toHaveBeenCalled(); // Verificando se o método foi chamado
    });

    it('Deve retornar uma lista vazia se não houver pedidos', async () => {
        (pedidoGateway.listarPedidos as jest.Mock).mockResolvedValue([]); // Simulando lista vazia

      const resultado = await listarPedidoUseCase.execute(pedidoGateway);

      expect(resultado).toEqual([]); // Verificando se uma lista vazia foi retornada
      expect(pedidoGateway.listarPedidos).toHaveBeenCalled(); // Verificando se o método foi chamado
    });

    it('Deve lançar um erro se o gateway falhar', async () => {
        (pedidoGateway.listarPedidos as jest.Mock).mockRejectedValue(
        new Error('Erro ao listar pedidos')
      ); // Simulando erro no gateway

      await expect(listarPedidoUseCase.execute(pedidoGateway))
        .rejects
        .toThrowError('Erro ao listar pedidos'); // Verificando se o erro foi lançado
    });
  });
});
