import { Test, TestingModule } from '@nestjs/testing';
import { PedidoGateway } from './pedido-gateway';
import { IPedidoRepository } from '../../external/repository/pedido-repository.interface';
import { IPedidoCacheRepository } from '../../external/repository/pedido-cache-repository.interface';
import { Pedido } from '../../entities/pedido';
import { AtualizarPedidoDTO } from '../../dto/atualizarStatusPedidoDTO';

describe('PedidoGateway', () => {
  let pedidoGateway: PedidoGateway;
  let pedidoRepositoryMock: IPedidoRepository;
  let pedidoCacheRepositoryMock: IPedidoCacheRepository;

  beforeEach(async () => {
    pedidoRepositoryMock = {
      salvarPedido: jest.fn(),
      listarPorIdCliente: jest.fn(),
      listarPedidos: jest.fn(),
      buscarPorIdPedido: jest.fn(),
      buscarPorIdPagamento: jest.fn(),
      atualizarStatusPedido: jest.fn(),
    } as unknown as IPedidoRepository;

    pedidoCacheRepositoryMock = {
      adicionarPedidoCache: jest.fn(),
      removerPedidoCache: jest.fn(),
      listarPedidosAtivos: jest.fn(),
      atualizarStatusPedidoCache: jest.fn(),
    } as unknown as IPedidoCacheRepository;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoGateway,
        { provide: IPedidoRepository, useValue: pedidoRepositoryMock },
        { provide: IPedidoCacheRepository, useValue: pedidoCacheRepositoryMock },
      ],
    }).compile();

    pedidoGateway = module.get<PedidoGateway>(PedidoGateway);
  });

  describe('salvarPedido', () => {
    it('deve salvar um pedido', async () => {
      const pedido = new Pedido('cliente1', [], 'pagamento123');
      (pedidoRepositoryMock.salvarPedido as jest.Mock).mockResolvedValue(pedido);

      const result = await pedidoGateway.salvarPedido(pedido);

      expect(result).toEqual(pedido);
      expect(pedidoRepositoryMock.salvarPedido).toHaveBeenCalledWith(pedido);
    });
  });

  describe('listarPorIdCliente', () => {
    it('deve listar pedidos por idCliente', async () => {
      const pedidos = [new Pedido('cliente1', [], 'pagamento123')];
      (pedidoRepositoryMock.listarPorIdCliente as jest.Mock).mockResolvedValue(pedidos);

      const result = await pedidoGateway.listarPorIdCliente('cliente1');

      expect(result).toEqual(pedidos);
      expect(pedidoRepositoryMock.listarPorIdCliente).toHaveBeenCalledWith('cliente1');
    });
  });

  describe('listarPedidos', () => {
    it('deve listar todos os pedidos', async () => {
      const pedidos = [new Pedido('cliente1', [], 'pagamento123')];
      (pedidoRepositoryMock.listarPedidos as jest.Mock).mockResolvedValue(pedidos);

      const result = await pedidoGateway.listarPedidos();

      expect(result).toEqual(pedidos);
      expect(pedidoRepositoryMock.listarPedidos).toHaveBeenCalled();
    });
  });

  describe('buscarPorIdPedido', () => {
    it('deve buscar pedido por id', async () => {
      const pedido = new Pedido('cliente1', [], 'pagamento123');
      (pedidoRepositoryMock.buscarPorIdPedido as jest.Mock).mockResolvedValue(pedido);

      const result = await pedidoGateway.buscarPorIdPedido('pedido123');

      expect(result).toEqual(pedido);
      expect(pedidoRepositoryMock.buscarPorIdPedido).toHaveBeenCalledWith('pedido123');
    });
  });

  describe('atualizarStatusPedido', () => {
    it('deve atualizar o status de um pedido', async () => {
      const atualizarPedidoDTO: AtualizarPedidoDTO = { status: 'FINALIZADO' };
      const pedido = new Pedido('cliente1', [], 'pagamento123');
      (pedidoRepositoryMock.atualizarStatusPedido as jest.Mock).mockResolvedValue(pedido);

      const result = await pedidoGateway.atualizarStatusPedido('pedido123', atualizarPedidoDTO);

      expect(result).toEqual(pedido);
      expect(pedidoRepositoryMock.atualizarStatusPedido).toHaveBeenCalledWith('pedido123', atualizarPedidoDTO);
    });
  });

  describe('adicionarPedidoCache', () => {
    it('deve adicionar um pedido ao cache', async () => {
      const pedido = new Pedido('cliente1', [], 'pagamento123');
      (pedidoCacheRepositoryMock.adicionarPedidoCache as jest.Mock).mockResolvedValue(undefined);

      await pedidoGateway.adicionarPedidoCache(pedido);

      expect(pedidoCacheRepositoryMock.adicionarPedidoCache).toHaveBeenCalledWith(pedido);
    });
  });

  describe('removerPedidoCache', () => {
    it('deve remover um pedido do cache', async () => {
      const pedidoId = 'pedido123';
      (pedidoCacheRepositoryMock.removerPedidoCache as jest.Mock).mockResolvedValue(undefined);

      await pedidoGateway.removerPedidoCache(pedidoId);

      expect(pedidoCacheRepositoryMock.removerPedidoCache).toHaveBeenCalledWith(pedidoId);
    });
  });

  describe('listarPedidosAtivos', () => {
    it('deve listar pedidos ativos', async () => {
      const pedidos = [new Pedido('cliente1', [], 'pagamento123')];
      (pedidoCacheRepositoryMock.listarPedidosAtivos as jest.Mock).mockResolvedValue(pedidos);

      const result = await pedidoGateway.listarPedidosAtivos();

      expect(result).toEqual(pedidos);
      expect(pedidoCacheRepositoryMock.listarPedidosAtivos).toHaveBeenCalled();
    });
  });

  describe('atualizarStatusPedidoCache', () => {
    it('deve atualizar o status de um pedido no cache', async () => {
      const id = 'pedido123';
      const novoStatus = 'FINALIZADO';
      (pedidoCacheRepositoryMock.atualizarStatusPedidoCache as jest.Mock).mockResolvedValue(undefined);

      await pedidoGateway.atualizarStatusPedidoCache(id, novoStatus);

      expect(pedidoCacheRepositoryMock.atualizarStatusPedidoCache).toHaveBeenCalledWith(id, novoStatus);
    });
  });
});
