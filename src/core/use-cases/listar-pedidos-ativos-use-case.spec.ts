import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidosAtivosUseCase } from '../use-cases/listar-pedidos-ativos-use-case';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';

describe('ListarPedidosAtivosUseCase', () => {
  let listarPedidosAtivosUseCase: ListarPedidosAtivosUseCase;
  let pedidoGateway: PedidoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidosAtivosUseCase,
        PedidoGateway
      ],
    }).compile();

    listarPedidosAtivosUseCase = module.get<ListarPedidosAtivosUseCase>(ListarPedidosAtivosUseCase);
    pedidoGateway = module.get<PedidoGateway>('PedidoGateway');
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
