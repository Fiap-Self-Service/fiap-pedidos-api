import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidoPorIdClienteController } from './listar-pedido-filtrado-controller';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { ListarPedidoPorIdClienteUseCase } from '../../use-cases/listar-pedido-filtrado-use-case';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { Pedido } from '../../entities/pedido';
import { ItemPedido } from 'src/core/entities/item-pedido';

describe('ListarPedidoPorIdClienteController', () => {
  let controller: ListarPedidoPorIdClienteController;
  let pedidoGatewayMock: PedidoGateway;
  let listarPedidoPorIdClienteUseCaseMock: ListarPedidoPorIdClienteUseCase;

  beforeEach(async () => {
    pedidoGatewayMock = {
      listarPorIdCliente: jest.fn(),
    } as unknown as PedidoGateway;

    listarPedidoPorIdClienteUseCaseMock = {
      execute: jest.fn(),
    } as unknown as ListarPedidoPorIdClienteUseCase;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidoPorIdClienteController,
        { provide: PedidoGateway, useValue: pedidoGatewayMock },
        { provide: ListarPedidoPorIdClienteUseCase, useValue: listarPedidoPorIdClienteUseCaseMock },
      ],
    }).compile();

    controller = module.get<ListarPedidoPorIdClienteController>(ListarPedidoPorIdClienteController);
  });

  describe('execute', () => {
    it('deve retornar uma lista de PedidoDTOs para um cliente', async () => {
      const pedidos: Pedido[] = [
        new Pedido('cliente1', [
          { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
        ], 'pagamento123'),
        new Pedido('cliente1', [
          { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
        ], 'pagamento456'),
      ];

      // Simulando que o UseCase retorna uma lista de pedidos filtrados por cliente
      (listarPedidoPorIdClienteUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidos);

      const result = await controller.execute('cliente1');

      // Verificando se o resultado retornado é uma lista de PedidoDTO
      const expectedPedidoDTOs: PedidoDTO[] = pedidos.map(pedido => ({ ...pedido }));
      expect(result).toEqual(expectedPedidoDTOs);
      expect(listarPedidoPorIdClienteUseCaseMock.execute).toHaveBeenCalledWith(pedidoGatewayMock, 'cliente1');
    });

    it('deve retornar uma lista vazia quando não houver pedidos para o cliente', async () => {
      // Simulando que o UseCase retorna uma lista vazia
      (listarPedidoPorIdClienteUseCaseMock.execute as jest.Mock).mockResolvedValue([]);

      const result = await controller.execute('cliente1');

      // Verificando se o resultado retornado é uma lista vazia
      expect(result).toEqual([]);
    });

    it('deve lançar erro quando ocorrer um problema ao listar os pedidos do cliente', async () => {
      // Simulando erro no UseCase
      (listarPedidoPorIdClienteUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Erro ao listar pedidos do cliente'));

      try {
        await controller.execute('cliente1');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Erro ao listar pedidos do cliente');
      }
    });
  });
});
