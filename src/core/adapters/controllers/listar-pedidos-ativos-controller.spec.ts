import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidosAtivosController } from './listar-pedidos-ativos-controller';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { ListarPedidosAtivosUseCase } from '../../use-cases/listar-pedidos-ativos-use-case';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { Pedido } from '../../entities/pedido';
import { ItemPedido } from 'src/core/entities/item-pedido';

describe('ListarPedidosAtivosController', () => {
  let controller: ListarPedidosAtivosController;
  let pedidoGatewayMock: PedidoGateway;
  let listarPedidosAtivosUseCaseMock: ListarPedidosAtivosUseCase;

  beforeEach(async () => {
    pedidoGatewayMock = {
      listarPedidosAtivos: jest.fn(),
    } as unknown as PedidoGateway;

    listarPedidosAtivosUseCaseMock = {
      execute: jest.fn(),
    } as unknown as ListarPedidosAtivosUseCase;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidosAtivosController,
        { provide: PedidoGateway, useValue: pedidoGatewayMock },
        { provide: ListarPedidosAtivosUseCase, useValue: listarPedidosAtivosUseCaseMock },
      ],
    }).compile();

    controller = module.get<ListarPedidosAtivosController>(ListarPedidosAtivosController);
  });

  describe('execute', () => {
    it('deve retornar uma lista de PedidoDTOs ativos', async () => {
      const pedidosAtivos = [new Pedido('cliente1', [
        { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
        { idProduto: 'produto2', quantidade: 2, valor: 50 } as ItemPedido
      ], 'pagamento123'),
      new Pedido('cliente2', [
        { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
        { idProduto: 'produto2', quantidade: 2, valor: 50 } as ItemPedido
      ], 'pagamento456')];

      // Simulando que o UseCase retorna uma lista de pedidos ativos
      (listarPedidosAtivosUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidosAtivos);

      const result = await controller.execute();

      // Verificando se o resultado retornado é uma lista de PedidoDTO
      const expectedPedidoDTOs: PedidoDTO[] = pedidosAtivos.map(pedido => ({ ...pedido }));
      expect(result).toEqual(expectedPedidoDTOs);
      expect(listarPedidosAtivosUseCaseMock.execute).toHaveBeenCalledWith(pedidoGatewayMock);
    });

    it('deve retornar uma lista vazia quando não houver pedidos ativos', async () => {
      // Simulando que o UseCase retorna uma lista vazia
      (listarPedidosAtivosUseCaseMock.execute as jest.Mock).mockResolvedValue([]);

      const result = await controller.execute();

      // Verificando se o resultado retornado é uma lista vazia
      expect(result).toEqual([]);
    });

    it('deve lançar erro quando ocorrer um problema ao listar os pedidos ativos', async () => {
      // Simulando erro no UseCase
      (listarPedidosAtivosUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Erro ao listar pedidos ativos'));

      try {
        await controller.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Erro ao listar pedidos ativos');
      }
    });
  });
});
