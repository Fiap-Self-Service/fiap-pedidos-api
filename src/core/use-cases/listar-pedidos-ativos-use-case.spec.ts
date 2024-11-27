import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidosAtivosUseCase } from '../use-cases/listar-pedidos-ativos-use-case';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';
import { IPedidoRepository } from '../external/repository/pedido-repository.interface';
import { IPedidoCacheRepository } from '../external/repository/pedido-cache-repository.interface';

jest.mock('../adapters/gateways/pedido-gateway'); // Mocka a classe PedidoGateway

describe('ListarPedidosAtivosUseCase', () => {
  let listarPedidosAtivosUseCase: ListarPedidosAtivosUseCase;
  let pedidoGateway: jest.Mocked<PedidoGateway>; // Agora é um mock da classe PedidoGateway
  let pedidoRepositoryMock: jest.Mock;
  let pedidoCacheRepositoryMock: jest.Mock;

  beforeEach(async () => {
    pedidoRepositoryMock = jest.fn(); 
    pedidoCacheRepositoryMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidosAtivosUseCase,
        PedidoGateway, // Agora já está sendo mockada globalmente
        {
          provide: IPedidoRepository, // Mock do IPedidoRepository
          useValue: pedidoRepositoryMock,
        },
        {
          provide: IPedidoCacheRepository, // Mock do IPedidoCacheRepository
          useValue: pedidoCacheRepositoryMock,
        }
      ],
    }).compile();

    listarPedidosAtivosUseCase = module.get<ListarPedidosAtivosUseCase>(ListarPedidosAtivosUseCase);
    pedidoGateway = module.get<jest.Mocked<PedidoGateway>>(PedidoGateway);

    // Mockando especificamente o método listarPedidosAtivos
    pedidoGateway.listarPedidosAtivos = jest.fn(); 
  });

  describe('execute', () => {
    it('Deve retornar uma lista de pedidos ativos', async () => {
      const itemPedido1 = new ItemPedido('pedido123', 'produto1', 2, 100);
      const itemPedido2 = new ItemPedido('pedido456', 'produto2', 1, 50);

      const pedidosAtivos = [
        new Pedido('cliente123', [itemPedido1], 'intencaoPagamento123'),
        new Pedido('cliente456', [itemPedido2], 'intencaoPagamento456'),
      ];

      (pedidoGateway.listarPedidosAtivos as jest.Mock).mockResolvedValue(pedidosAtivos); // Simulando pedidos ativos

      const resultado = await listarPedidosAtivosUseCase.execute(pedidoGateway);

      expect(resultado).toEqual(pedidosAtivos); // Verificando se os pedidos ativos foram retornados corretamente
      expect(pedidoGateway.listarPedidosAtivos).toHaveBeenCalled(); // Verificando se o método foi chamado
    });

    it('Deve retornar uma lista vazia se não houver pedidos ativos', async () => {
      (pedidoGateway.listarPedidosAtivos as jest.Mock).mockResolvedValue([]); // Simulando nenhum pedido ativo

      const resultado = await listarPedidosAtivosUseCase.execute(pedidoGateway);

      expect(resultado).toEqual([]); // Verificando se uma lista vazia foi retornada
      expect((pedidoGateway.listarPedidosAtivos as jest.Mock)).toHaveBeenCalled(); // Verificando se o método foi chamado
    });

    it('Deve lançar um erro se o gateway falhar', async () => {
      (pedidoGateway.listarPedidosAtivos as jest.Mock).mockRejectedValue(
        new Error('Erro ao listar pedidos ativos')
      ); // Simulando erro no gateway

      await expect(listarPedidosAtivosUseCase.execute(pedidoGateway))
        .rejects
        .toThrowError('Erro ao listar pedidos ativos'); // Verificando se o erro foi lançado
    });
  });
});
