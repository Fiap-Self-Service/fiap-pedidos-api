import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidoController } from './listar-pedido-controller';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { ListarPedidoUseCase } from '../../use-cases/listar-pedido-use-case';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { Pedido } from '../../entities/pedido';
import { ItemPedido } from 'src/core/entities/item-pedido';

describe('ListarPedidoController', () => {
  let controller: ListarPedidoController;
  let pedidoGatewayMock: PedidoGateway;
  let listarPedidoUseCaseMock: ListarPedidoUseCase;

  beforeEach(async () => {
    pedidoGatewayMock = {
      listarPedidos: jest.fn(),
    } as unknown as PedidoGateway;

    listarPedidoUseCaseMock = {
      execute: jest.fn(),
    } as unknown as ListarPedidoUseCase;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidoController,
        { provide: PedidoGateway, useValue: pedidoGatewayMock },
        { provide: ListarPedidoUseCase, useValue: listarPedidoUseCaseMock },
      ],
    }).compile();

    controller = module.get<ListarPedidoController>(ListarPedidoController);
  });

  describe('execute', () => {
    it('deve retornar uma lista de PedidoDTOs', async () => {
      const pedidos = [new Pedido('cliente1', [
        { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
        { idProduto: 'produto2', quantidade: 2, valor: 50 } as ItemPedido
      ], 'pagamento123'),
      new Pedido('cliente2', [
        { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
        { idProduto: 'produto2', quantidade: 2, valor: 50 } as ItemPedido
      ], 'pagamento456')];

      // Simulando que o UseCase retorna uma lista de pedidos
      (listarPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidos);

      const result = await controller.execute();

      // Verificando se o resultado retornado é uma lista de PedidoDTO e se é igual à lista simulada
      const expectedPedidoDTOs: PedidoDTO[] = pedidos.map(pedido => ({ ...pedido }));
      expect(result).toEqual(expectedPedidoDTOs);
      expect(listarPedidoUseCaseMock.execute).toHaveBeenCalledWith(pedidoGatewayMock);
    });

    it('deve retornar uma lista vazia quando não houver pedidos', async () => {
      // Simulando que o UseCase retorna uma lista vazia
      (listarPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue([]);

      const result = await controller.execute();

      // Verificando se o resultado retornado é uma lista vazia
      expect(result).toEqual([]);
    });

    it('deve lançar erro quando ocorrer um problema ao listar os pedidos', async () => {
      // Simulando erro no UseCase
      (listarPedidoUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Erro ao listar pedidos'));

      try {
        await controller.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Erro ao listar pedidos');
      }
    });
  });
});
