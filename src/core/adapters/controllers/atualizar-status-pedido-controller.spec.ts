import { Test, TestingModule } from '@nestjs/testing';
import { AtualizarStatusPedidoController } from './atualizar-status-pedido-controller';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { AtualizarStatusPedidoUseCase } from '../../use-cases/atualizar-status-pedido-use-case';
import { AtualizarPedidoDTO } from '../../dto/atualizarStatusPedidoDTO';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { Pedido } from '../../entities/pedido';
import { IPedidoRepository } from '../../external/repository/pedido-repository.interface';
import { IPedidoCacheRepository } from '../../external/repository/pedido-cache-repository.interface';
import { ItemPedido } from 'src/core/entities/item-pedido';

jest.mock('../gateways/pedido-gateway');

describe('AtualizarStatusPedidoController', () => {
  let controller: AtualizarStatusPedidoController;
  let pedidoGateway: jest.Mocked<PedidoGateway>;
  let atualizarStatusPedidoUseCaseMock: jest.Mocked<AtualizarStatusPedidoUseCase>;
  let pedidoRepositoryMock: jest.Mock;
  let pedidoCacheRepositoryMock: jest.Mock;

  beforeEach(async () => {
    pedidoRepositoryMock = jest.fn(); 
    pedidoCacheRepositoryMock = jest.fn();

    atualizarStatusPedidoUseCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AtualizarStatusPedidoUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtualizarStatusPedidoController],
      providers: [
        PedidoGateway,
        {
          provide: AtualizarStatusPedidoUseCase,
          useValue: atualizarStatusPedidoUseCaseMock,
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

    controller = module.get<AtualizarStatusPedidoController>(AtualizarStatusPedidoController);
    pedidoGateway = module.get<jest.Mocked<PedidoGateway>>(PedidoGateway);
    atualizarStatusPedidoUseCaseMock = module.get<jest.Mocked<AtualizarStatusPedidoUseCase>>(AtualizarStatusPedidoUseCase);
  });

  describe('Construtor', () => {
    it('deve instanciar o controlador corretamente', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('execute', () => {
    const id = 'pedido123';
    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = { status: 'FINALIZADO' };
    const pedidoAtualizado = new Pedido('cliente1', [
      { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
    ], 'pagamento123');
    pedidoAtualizado.status = 'FINALIZADO';

    it('deve atualizar o status do pedido e retornar o PedidoDTO', async () => {
      (atualizarStatusPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidoAtualizado); // Simula o retorno do UseCase

      const result = await controller.execute(id, atualizarStatusPedidoDTO); // Chama o controller

      const adapterPresenter: PedidoDTO = { ...pedidoAtualizado }; // Adapta o modelo
      expect(result).toEqual(adapterPresenter); // Verifica se o resultado está correto

      expect(atualizarStatusPedidoUseCaseMock.execute).toHaveBeenCalledWith(
        pedidoGateway,
        id,
        atualizarStatusPedidoDTO
      );
    });

    it('deve lançar erro se o UseCase falhar', async () => {
      (atualizarStatusPedidoUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Erro ao atualizar status')); // Simula falha

      await expect(controller.execute(id, atualizarStatusPedidoDTO)).rejects.toThrow('Erro ao atualizar status');

      expect(atualizarStatusPedidoUseCaseMock.execute).toHaveBeenCalledWith(
        pedidoGateway,
        id,
        atualizarStatusPedidoDTO
      );
    });

    it('deve transformar corretamente o retorno para PedidoDTO', async () => {
      (atualizarStatusPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidoAtualizado); // Simula retorno com status 'FINALIZADO'

      const result = await controller.execute(id, atualizarStatusPedidoDTO); // Chama o controller

      expect(result).toEqual({ ...pedidoAtualizado }); // Verifica se o modelo foi transformado corretamente
      expect(result.status).toBe('FINALIZADO'); // Verifica se o status foi corretamente atualizado
    });

    it('deve garantir que o pedido retornado contém todas as propriedades esperadas', async () => {
      (atualizarStatusPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidoAtualizado); // Simula retorno com dados do pedido

      const result = await controller.execute(id, atualizarStatusPedidoDTO);

      expect(result).toHaveProperty('status', 'FINALIZADO');
      expect(result).toHaveProperty('idPagamento', 'pagamento123');
      expect(result).toHaveProperty('combo', [{ idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido]); // Verifica se as propriedades do pedido estão corretas
    });

    it('deve verificar chamadas ao Gateway durante a execução', async () => {
      (atualizarStatusPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidoAtualizado);
  
      await controller.execute(id, atualizarStatusPedidoDTO);
  
      // Verifica que o método `atualizarStatusPedido` não foi chamado diretamente no Gateway
      expect(pedidoGateway.atualizarStatusPedido).not.toHaveBeenCalled();
    });
  });
});
