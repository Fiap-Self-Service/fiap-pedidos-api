import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarPedidoPorIdController } from './consultar-pedido-controller';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { ConsultarPedidoPorIdUseCase } from '../../use-cases/consultar-pedido-use-case';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { Pedido } from '../../entities/pedido';

describe('ConsultarPedidoPorIdController', () => {
  let controller: ConsultarPedidoPorIdController;
  let pedidoGatewayMock: PedidoGateway;
  let consultarPedidoPorIdUseCaseMock: ConsultarPedidoPorIdUseCase;

  beforeEach(async () => {
    pedidoGatewayMock = {
      buscarPorIdPedido: jest.fn(),
    } as unknown as PedidoGateway;

    consultarPedidoPorIdUseCaseMock = {
      execute: jest.fn(),
    } as unknown as ConsultarPedidoPorIdUseCase;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultarPedidoPorIdController,
        { provide: PedidoGateway, useValue: pedidoGatewayMock },
        { provide: ConsultarPedidoPorIdUseCase, useValue: consultarPedidoPorIdUseCaseMock },
      ],
    }).compile();

    controller = module.get<ConsultarPedidoPorIdController>(ConsultarPedidoPorIdController);
  });

  describe('execute', () => {
    it('deve retornar um PedidoDTO ao consultar um pedido por ID', async () => {
      const idPedido = 'pedido123';
      const pedido = new Pedido('cliente1', [], 'pagamento123');
      pedido.id = idPedido;

      // Simulando a resposta do UseCase
      (consultarPedidoPorIdUseCaseMock.execute as jest.Mock).mockResolvedValue(pedido);

      const result = await controller.execute(idPedido);

      // Verificando se o resultado retornado é do tipo PedidoDTO e contém as informações esperadas
      const expectedPedidoDTO: PedidoDTO = { ...pedido };
      expect(result).toEqual(expectedPedidoDTO);
      expect(consultarPedidoPorIdUseCaseMock.execute).toHaveBeenCalledWith(pedidoGatewayMock, idPedido);
    });

    it('deve lançar erro se o pedido não for encontrado', async () => {
      const idPedido = 'pedido123';
      
      // Simulando que o pedido não foi encontrado
      (consultarPedidoPorIdUseCaseMock.execute as jest.Mock).mockResolvedValue(null);

      try {
        await controller.execute(idPedido);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Pedido não encontrado');
      }
    });
  });
});
