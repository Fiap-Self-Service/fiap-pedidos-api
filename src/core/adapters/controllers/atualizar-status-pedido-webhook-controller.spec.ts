import { Test, TestingModule } from '@nestjs/testing';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { AtualizarStatusPedidoWebhookUseCase } from '../../use-cases/atualizar-status-pedido-webhook-use-case';
import { AtualizarPedidoDTO } from '../../dto/atualizarStatusPedidoDTO';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { Pedido } from '../../entities/pedido';
import { IPedidoRepository } from '../../external/repository/pedido-repository.interface';
import { IPedidoCacheRepository } from '../../external/repository/pedido-cache-repository.interface';
import { ItemPedido } from 'src/core/entities/item-pedido';
import { AtualizarStatusPedidoWebhookController } from './atualizar-status-pedido-webhook-controller';

jest.mock('../gateways/pedido-gateway');

describe('AtualizarStatusPedidoController', () => {
  let controller: AtualizarStatusPedidoWebhookController;
  let pedidoGateway: jest.Mocked<PedidoGateway>;
  let atualizarStatusPedidoWebhookUseCaseMock: jest.Mocked<AtualizarStatusPedidoWebhookUseCase>;
  let pedidoRepositoryMock: jest.Mock;
  let pedidoCacheRepositoryMock: jest.Mock;

  beforeEach(async () => {
    pedidoRepositoryMock = jest.fn();
    pedidoCacheRepositoryMock = jest.fn();

    atualizarStatusPedidoWebhookUseCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AtualizarStatusPedidoWebhookUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtualizarStatusPedidoWebhookController],
      providers: [
        PedidoGateway,
        {
          provide: AtualizarStatusPedidoWebhookUseCase,
          useValue: atualizarStatusPedidoWebhookUseCaseMock,
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

    controller = module.get<AtualizarStatusPedidoWebhookController>(
      AtualizarStatusPedidoWebhookController,
    );
    pedidoGateway = module.get<jest.Mocked<PedidoGateway>>(PedidoGateway);
    atualizarStatusPedidoWebhookUseCaseMock = module.get<
      jest.Mocked<AtualizarStatusPedidoWebhookUseCase>
    >(AtualizarStatusPedidoWebhookUseCase);
  });

  describe('Construtor', () => {
    it('deve instanciar o controlador corretamente', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('execute', () => {
    const id = 'pedido123';
    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = {
      status: 'FINALIZADO',
    };
    const pedidoAtualizado = new Pedido(
      'cliente1',
      [{ idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido],
      'pagamento123',
    );
    pedidoAtualizado.status = 'FINALIZADO';

    it('deve atualizar o status do pedido e retornar o PedidoDTO', async () => {
      (
        atualizarStatusPedidoWebhookUseCaseMock.execute as jest.Mock
      ).mockResolvedValue(pedidoAtualizado);

      const result = await controller.execute(id, atualizarStatusPedidoDTO);

      const adapterPresenter: PedidoDTO = { ...pedidoAtualizado };
      expect(result).toEqual(adapterPresenter);

      expect(
        atualizarStatusPedidoWebhookUseCaseMock.execute,
      ).toHaveBeenCalledWith(pedidoGateway, id, atualizarStatusPedidoDTO);
    });

    it('deve lançar erro se o UseCase falhar', async () => {
      (
        atualizarStatusPedidoWebhookUseCaseMock.execute as jest.Mock
      ).mockRejectedValue(new Error('Erro ao atualizar status'));

      await expect(
        controller.execute(id, atualizarStatusPedidoDTO),
      ).rejects.toThrow('Erro ao atualizar status');

      expect(
        atualizarStatusPedidoWebhookUseCaseMock.execute,
      ).toHaveBeenCalledWith(pedidoGateway, id, atualizarStatusPedidoDTO);
    });

    it('deve transformar corretamente o retorno para PedidoDTO', async () => {
      (
        atualizarStatusPedidoWebhookUseCaseMock.execute as jest.Mock
      ).mockResolvedValue(pedidoAtualizado);

      const result = await controller.execute(id, atualizarStatusPedidoDTO);

      expect(result).toEqual({ ...pedidoAtualizado });
      expect(result.status).toBe('FINALIZADO');
    });

    it('deve garantir que o pedido retornado contém todas as propriedades esperadas', async () => {
      (
        atualizarStatusPedidoWebhookUseCaseMock.execute as jest.Mock
      ).mockResolvedValue(pedidoAtualizado);

      const result = await controller.execute(id, atualizarStatusPedidoDTO);

      expect(result).toHaveProperty('status', 'FINALIZADO');
      expect(result).toHaveProperty('idPagamento', 'pagamento123');
      expect(result).toHaveProperty('combo', [
        { idProduto: 'produto1', quantidade: 1, valor: 100 } as ItemPedido,
      ]);
    });

    it('deve verificar chamadas ao Gateway durante a execução', async () => {
      (
        atualizarStatusPedidoWebhookUseCaseMock.execute as jest.Mock
      ).mockResolvedValue(pedidoAtualizado);

      await controller.execute(id, atualizarStatusPedidoDTO);

      expect(pedidoGateway.atualizarStatusPedido).not.toHaveBeenCalled();
    });
  });
});
