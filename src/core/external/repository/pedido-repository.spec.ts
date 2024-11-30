import { PedidoRepository } from './pedido-repository';
import { PedidoEntity } from './pedido.entity';
import { ItemPedidoEntity } from './itemPedido.entity';
import { Repository } from 'typeorm';
import { AtualizarPedidoDTO } from '../../dto/atualizarStatusPedidoDTO';
import { Pedido } from '../../entities/pedido';
import { Not } from 'typeorm';

describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;
  let pedidoRepoMock: jest.Mocked<Repository<PedidoEntity>>;
  let itemPedidoRepoMock: jest.Mocked<Repository<ItemPedidoEntity>>;

  beforeEach(() => {
    // Mocks para os repositórios
    pedidoRepoMock = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<PedidoEntity>>;

    itemPedidoRepoMock = {
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<ItemPedidoEntity>>;

    pedidoRepository = new PedidoRepository(pedidoRepoMock, itemPedidoRepoMock);
  });

  it('deve salvar um pedido corretamente', async () => {
    const mockPedido = new PedidoEntity();
    mockPedido.id = '123';
    mockPedido.combo = [{ id: '1', idPedido: null } as ItemPedidoEntity];

    pedidoRepoMock.save.mockResolvedValue(mockPedido);
    itemPedidoRepoMock.save.mockResolvedValue(mockPedido.combo[0]);

    const result = await pedidoRepository.salvarPedido(mockPedido as Pedido);

    expect(pedidoRepoMock.save).toHaveBeenCalledWith(mockPedido);
    expect(itemPedidoRepoMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ idPedido: '123' }),
    );
    expect(result).toEqual(mockPedido);
  });

  it('deve listar pedidos pelo ID do cliente', async () => {
    const mockPedidos = [
      { id: '1', idCliente: 'cliente123', combo: [] } as PedidoEntity,
    ];

    pedidoRepoMock.find.mockResolvedValue(mockPedidos);

    const result = await pedidoRepository.listarPorIdCliente('cliente123');

    expect(pedidoRepoMock.find).toHaveBeenCalledWith({
      where: { idCliente: 'cliente123' },
      relations: ['combo'],
    });
    expect(result).toEqual(mockPedidos);
  });

  it('deve listar todos os pedidos', async () => {
    const mockPedidos = [
      { id: '1', status: 'RECEBIDO', combo: [] } as PedidoEntity,
    ];

    pedidoRepoMock.find.mockResolvedValue(mockPedidos);

    const result = await pedidoRepository.listarPedidos();

    expect(pedidoRepoMock.find).toHaveBeenCalledWith({
      relations: ['combo'],
      where: { status: Not('FINALIZADO') },
      order: { status: 'DESC', dataCriacao: 'ASC' },
    });
    expect(result).toEqual(mockPedidos);
  });

  it('deve buscar um pedido pelo ID', async () => {
    const mockPedido = { id: '1', combo: [] } as PedidoEntity;

    pedidoRepoMock.findOne.mockResolvedValue(mockPedido);

    const result = await pedidoRepository.buscarPorIdPedido('1');

    expect(pedidoRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['combo'],
    });
    expect(result).toEqual(mockPedido);
  });

  it('deve retornar null se o pedido não for encontrado pelo ID', async () => {
    pedidoRepoMock.findOne.mockResolvedValue(null);

    const result = await pedidoRepository.buscarPorIdPedido('2');

    expect(pedidoRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: '2' },
      relations: ['combo'],
    });
    expect(result).toBeNull();
  });

  it('deve atualizar o status de um pedido', async () => {
    const mockPedido = { id: '1', status: 'RECEBIDO' } as PedidoEntity;
    const atualizarStatusPedidoDTO = { status: 'PRONTO' } as AtualizarPedidoDTO;

    pedidoRepoMock.findOne.mockResolvedValue(mockPedido);
    pedidoRepoMock.update.mockResolvedValue(undefined);
    mockPedido.status = atualizarStatusPedidoDTO.status;

    const result = await pedidoRepository.atualizarStatusPedido(
      '1',
      atualizarStatusPedidoDTO,
    );

    expect(pedidoRepoMock.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(pedidoRepoMock.update).toHaveBeenCalledWith(
      { id: '1' },
      expect.objectContaining({ status: 'PRONTO' }),
    );
    expect(result).toEqual(mockPedido);
  });

  it('deve atualizar o status de um pedido pelo id pagamento', async () => {
    const mockPedido = { id: '1', status: 'RECEBIDO' } as PedidoEntity;
    const atualizarStatusPedidoDTO = { status: 'PRONTO' } as AtualizarPedidoDTO;

    pedidoRepoMock.findOne.mockResolvedValue(mockPedido);
    pedidoRepoMock.update.mockResolvedValue(undefined);
    mockPedido.status = atualizarStatusPedidoDTO.status;

    const result = await pedidoRepository.atualizarStatusPedidoPorIdPagamento(
      'id-pagamento',
      atualizarStatusPedidoDTO,
    );

    expect(pedidoRepoMock.findOne).toHaveBeenCalledWith({
      where: { idPagamento: 'id-pagamento' },
    });
    expect(pedidoRepoMock.update).toHaveBeenCalledWith(
      { idPagamento: 'id-pagamento' },
      expect.objectContaining({ status: 'PRONTO' }),
    );
    expect(result).toEqual(mockPedido);
  });

  it('deve buscar um pedido pelo ID do pagamento', async () => {
    const mockPedido = {
      id: '1',
      idPagamento: 'pag123',
      combo: [],
    } as PedidoEntity;

    pedidoRepoMock.findOne.mockResolvedValue(mockPedido);

    const result = await pedidoRepository.buscarPorIdPagamento('pag123');

    expect(pedidoRepoMock.findOne).toHaveBeenCalledWith({
      where: { idPagamento: 'pag123' },
      relations: ['combo'],
    });
    expect(result).toEqual(mockPedido);
  });

  it('deve retornar null se nenhum pedido for encontrado pelo ID do pagamento', async () => {
    pedidoRepoMock.findOne.mockResolvedValue(null);

    const result = await pedidoRepository.buscarPorIdPagamento('pag456');

    expect(pedidoRepoMock.findOne).toHaveBeenCalledWith({
      where: { idPagamento: 'pag456' },
      relations: ['combo'],
    });
    expect(result).toBeNull();
  });
});
