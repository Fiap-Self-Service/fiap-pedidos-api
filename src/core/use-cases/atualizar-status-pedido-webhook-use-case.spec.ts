import { HttpException, HttpStatus } from '@nestjs/common';
import { AtualizarStatusPedidoWebhookUseCase } from './atualizar-status-pedido-webhook-use-case';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { Pedido } from '../entities/pedido';
import { AtualizarPedidoDTO } from '../dto/atualizarStatusPedidoDTO';
import { PedidoStatusType } from '../entities/pedido-status-type.enum';

describe('AtualizarStatusPedidoUseCase', () => {
  let atualizarStatusPedidoUseCase: AtualizarStatusPedidoWebhookUseCase;
  let pedidoGateway: jest.Mocked<PedidoGateway>;

  beforeEach(() => {
    atualizarStatusPedidoUseCase = new AtualizarStatusPedidoWebhookUseCase();
    pedidoGateway = {
      buscarPorIdPagamento: jest.fn(),
      atualizarStatusPedidoWebhook: jest.fn(),
      removerPedidoCache: jest.fn(),
      atualizarStatusPedidoCache: jest.fn(),
    } as unknown as jest.Mocked<PedidoGateway>;
  });

  it('Deve atualizar o status do pedido para RECEBIDO', async () => {
    const pedido: Pedido = new Pedido(
      'cliente123',
      [
        {
          idProduto: 'produto1',
          quantidade: 2,
          valor: 100,
          idPedido: 'pedido123',
          id: null,
        },
      ],
      'intencaoPagamento123',
    );
    pedido.id = 'pedido123';
    pedido.status = PedidoStatusType.PREPARACAO;

    pedidoGateway.buscarPorIdPagamento.mockResolvedValue(pedido);

    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = {
      status: PedidoStatusType.RECEBIDO,
    };

    const pedidoAtualizado: Pedido = {
      ...pedido,
      status: PedidoStatusType.RECEBIDO,
    };
    pedidoGateway.atualizarStatusPedidoWebhook.mockResolvedValue(pedidoAtualizado);

    const result = await atualizarStatusPedidoUseCase.execute(
      pedidoGateway,
      'pedido123',
      atualizarStatusPedidoDTO,
    );

    expect(pedidoGateway.buscarPorIdPagamento).toHaveBeenCalledWith('pedido123');
    expect(pedidoGateway.atualizarStatusPedidoWebhook).toHaveBeenCalledWith(
      'pedido123',
      atualizarStatusPedidoDTO,
    );
    expect(pedidoGateway.atualizarStatusPedidoCache).toHaveBeenCalledWith(
      'pedido123',
      PedidoStatusType.RECEBIDO,
    );
    expect(result).toEqual(pedidoAtualizado);
  });

  it('Deve atualizar o status do pedido para PREPARACAO e mantê-lo no cache', async () => {
    const pedido: Pedido = new Pedido(
      'cliente123',
      [
        {
          idProduto: 'produto1',
          quantidade: 2,
          valor: 100,
          idPedido: 'pedido123',
          id: null,
        },
      ],
      'intencaoPagamento123',
    );
    pedido.id = 'pedido123';
    pedido.status = PedidoStatusType.RECEBIDO;

    pedidoGateway.buscarPorIdPagamento.mockResolvedValue(pedido);

    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = {
      status: PedidoStatusType.PREPARACAO,
    };

    const pedidoAtualizado: Pedido = {
      ...pedido,
      status: PedidoStatusType.PREPARACAO,
    };
    pedidoGateway.atualizarStatusPedidoWebhook.mockResolvedValue(pedidoAtualizado);

    const result = await atualizarStatusPedidoUseCase.execute(
      pedidoGateway,
      'pedido123',
      atualizarStatusPedidoDTO,
    );

    expect(pedidoGateway.buscarPorIdPagamento).toHaveBeenCalledWith('pedido123');
    expect(pedidoGateway.atualizarStatusPedidoWebhook).toHaveBeenCalledWith(
      'pedido123',
      atualizarStatusPedidoDTO,
    );
    expect(pedidoGateway.atualizarStatusPedidoCache).toHaveBeenCalledWith(
      'pedido123',
      PedidoStatusType.PREPARACAO,
    );
    expect(result).toEqual(pedidoAtualizado);
  });

  it('Deve atualizar o status do pedido para PRONTO e mantê-lo no cache', async () => {
    const pedido: Pedido = new Pedido(
      'cliente123',
      [
        {
          idProduto: 'produto1',
          quantidade: 2,
          valor: 100,
          idPedido: 'pedido123',
          id: null,
        },
      ],
      'intencaoPagamento123',
    );
    pedido.id = 'pedido123';
    pedido.status = PedidoStatusType.PREPARACAO;

    pedidoGateway.buscarPorIdPagamento.mockResolvedValue(pedido);

    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = {
      status: PedidoStatusType.PRONTO,
    };

    const pedidoAtualizado: Pedido = {
      ...pedido,
      status: PedidoStatusType.PRONTO,
    };
    pedidoGateway.atualizarStatusPedidoWebhook.mockResolvedValue(pedidoAtualizado);

    const result = await atualizarStatusPedidoUseCase.execute(
      pedidoGateway,
      'pedido123',
      atualizarStatusPedidoDTO,
    );

    expect(pedidoGateway.buscarPorIdPagamento).toHaveBeenCalledWith('pedido123');
    expect(pedidoGateway.atualizarStatusPedidoWebhook).toHaveBeenCalledWith(
      'pedido123',
      atualizarStatusPedidoDTO,
    );
    expect(pedidoGateway.atualizarStatusPedidoCache).toHaveBeenCalledWith(
      'pedido123',
      PedidoStatusType.PRONTO,
    );
    expect(result).toEqual(pedidoAtualizado);
  });

  it('Deve atualizar o status do pedido para FINALIZADO e removê-lo do cache', async () => {
    const pedido: Pedido = new Pedido(
      'cliente123',
      [
        {
          idProduto: 'produto1',
          quantidade: 2,
          valor: 100,
          idPedido: 'pedido123',
          id: null,
        },
      ],
      'intencaoPagamento123',
    );
    pedido.id = 'pedido123';
    pedido.status = PedidoStatusType.PRONTO;

    pedidoGateway.buscarPorIdPagamento.mockResolvedValue(pedido);

    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = {
      status: PedidoStatusType.FINALIZADO,
    };

    const pedidoAtualizado: Pedido = {
      ...pedido,
      status: PedidoStatusType.FINALIZADO,
    };
    pedidoGateway.atualizarStatusPedidoWebhook.mockResolvedValue(pedidoAtualizado);

    const result = await atualizarStatusPedidoUseCase.execute(
      pedidoGateway,
      'pedido123',
      atualizarStatusPedidoDTO,
    );

    expect(pedidoGateway.buscarPorIdPagamento).toHaveBeenCalledWith('pedido123');
    expect(pedidoGateway.atualizarStatusPedidoWebhook).toHaveBeenCalledWith(
      'pedido123',
      atualizarStatusPedidoDTO,
    );
    expect(pedidoGateway.removerPedidoCache).toHaveBeenCalledWith('pedido123');
    expect(result).toEqual(pedidoAtualizado);
  });

  it('Deve lançar exceção se o pedido não for encontrado', async () => {
    pedidoGateway.buscarPorIdPagamento.mockResolvedValue(null);

    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = {
      status: PedidoStatusType.FINALIZADO,
    };

    await expect(
      atualizarStatusPedidoUseCase.execute(
        pedidoGateway,
        'pedido123',
        atualizarStatusPedidoDTO,
      ),
    ).rejects.toThrow(
      new HttpException('Pedido não encontrado.', HttpStatus.BAD_REQUEST),
    );
  });

  it('Deve lançar exceção para falha ao atualizar o status do pedido', async () => {
    const pedido: Pedido = new Pedido(
      'cliente123',
      [
        {
          idProduto: 'produto1',
          quantidade: 2,
          valor: 100,
          idPedido: 'pedido123',
          id: null,
        },
      ],
      'intencaoPagamento123',
    );
    pedido.id = 'pedido123';

    pedidoGateway.buscarPorIdPagamento.mockResolvedValue(pedido);
    pedidoGateway.atualizarStatusPedidoWebhook.mockRejectedValue(
      new Error('Erro ao atualizar'),
    );

    const atualizarStatusPedidoDTO: AtualizarPedidoDTO = {
      status: PedidoStatusType.PRONTO,
    };

    await expect(
      atualizarStatusPedidoUseCase.execute(
        pedidoGateway,
        'pedido123',
        atualizarStatusPedidoDTO,
      ),
    ).rejects.toThrow(
      new HttpException(
        'Falha ao atualizar Pedido. Revise os dados enviados e tente novamente.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});