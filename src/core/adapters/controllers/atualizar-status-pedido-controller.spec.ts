import { Test, TestingModule } from '@nestjs/testing';
import { AtualizarStatusPedidoController } from './atualizar-status-pedido-controller';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { AtualizarStatusPedidoUseCase } from '../../use-cases/atualizar-status-pedido-use-case';
import { AtualizarPedidoDTO } from '../../dto/atualizarStatusPedidoDTO';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { Pedido } from '../../entities/pedido';

describe('AtualizarStatusPedidoController', () => {
  let controller: AtualizarStatusPedidoController;
  let pedidoGatewayMock: PedidoGateway;
  let atualizarStatusPedidoUseCaseMock: AtualizarStatusPedidoUseCase;

  beforeEach(async () => {
    pedidoGatewayMock = {
      atualizarStatusPedido: jest.fn(),
    } as unknown as PedidoGateway;

    atualizarStatusPedidoUseCaseMock = {
      execute: jest.fn(),
    } as unknown as AtualizarStatusPedidoUseCase;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtualizarStatusPedidoController,
        { provide: PedidoGateway, useValue: pedidoGatewayMock },
        { provide: AtualizarStatusPedidoUseCase, useValue: atualizarStatusPedidoUseCaseMock },
      ],
    }).compile();

    controller = module.get<AtualizarStatusPedidoController>(AtualizarStatusPedidoController);
  });

  describe('execute', () => {
    it('deve atualizar o status do pedido e retornar o PedidoDTO', async () => {
      const id = 'pedido123';
      const atualizarStatusPedidoDTO: AtualizarPedidoDTO = { status: 'FINALIZADO' };
      const pedidoAtualizado = new Pedido('cliente1', [], 'pagamento123');
      pedidoAtualizado.status = 'FINALIZADO';

      // Simulando a resposta do UseCase
      (atualizarStatusPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidoAtualizado);

      const result = await controller.execute(id, atualizarStatusPedidoDTO);

      // Verificando se o resultado retornado é do tipo PedidoDTO e contém as informações esperadas
      const expectedPedidoDTO: PedidoDTO = { ...pedidoAtualizado };

      expect(result).toEqual(expectedPedidoDTO);
      expect(atualizarStatusPedidoUseCaseMock.execute).toHaveBeenCalledWith(
        pedidoGatewayMock,
        id,
        atualizarStatusPedidoDTO
      );
    });

    it('deve lançar erro se o UseCase falhar', async () => {
      const id = 'pedido123';
      const atualizarStatusPedidoDTO: AtualizarPedidoDTO = { status: 'FINALIZADO' };
      
      // Simulando uma falha na execução do UseCase
      (atualizarStatusPedidoUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Erro ao atualizar status'));

      try {
        await controller.execute(id, atualizarStatusPedidoDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Erro ao atualizar status');
      }
    });
  });
});
