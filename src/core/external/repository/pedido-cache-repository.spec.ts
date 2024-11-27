import { PedidoCacheRepository } from './pedido-cache-repository';
import { DynamoDB } from 'aws-sdk';
import { PedidoEntity } from './pedido.entity';

jest.mock('aws-sdk');

describe('PedidoCacheRepository', () => {
  let pedidoCacheRepository: PedidoCacheRepository;
  let dynamoDbMock: jest.Mocked<DynamoDB.DocumentClient>;

  beforeEach(() => {
    dynamoDbMock = new DynamoDB.DocumentClient() as jest.Mocked<DynamoDB.DocumentClient>;
    pedidoCacheRepository = new PedidoCacheRepository(dynamoDbMock);
  });

  describe('listarPedidosAtivos', () => {
    it('deve retornar uma lista de pedidos ativos', async () => {
      const mockItems = [{ id: '1', status: 'RECEBIDO' }];
      dynamoDbMock.scan.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: mockItems }),
      } as any);

      const result = await pedidoCacheRepository.listarPedidosAtivos();

      expect(result).toEqual(mockItems);
      expect(dynamoDbMock.scan).toHaveBeenCalledWith({
        TableName: 'fiap-self-service-pedidos-ativos',
      });
    });

    it('deve lançar erro ao falhar ao listar pedidos ativos', async () => {
      const mockError = new Error('DynamoDB error');
      dynamoDbMock.scan.mockReturnValue({
        promise: jest.fn().mockRejectedValue(mockError),
      } as any);

      await expect(pedidoCacheRepository.listarPedidosAtivos()).rejects.toThrow(
        `Não foi possível listar os pedidos ativos: ${mockError.message}`
      );
    });
  });

  describe('adicionarPedidoCache', () => {
    it('deve adicionar um pedido ao cache', async () => {
      const mockPedido = { id: '1', status: 'RECEBIDO' } as PedidoEntity;
      dynamoDbMock.put.mockReturnValue({
        promise: jest.fn().mockResolvedValue(undefined),
      } as any);

      await pedidoCacheRepository.adicionarPedidoCache(mockPedido);

      expect(dynamoDbMock.put).toHaveBeenCalledWith({
        TableName: 'fiap-self-service-pedidos-ativos',
        Item: mockPedido,
      });
    });

    it('deve lançar erro ao falhar ao adicionar um pedido ao cache', async () => {
      const mockPedido = { id: '1', status: 'RECEBIDO' } as PedidoEntity;
      const mockError = new Error('DynamoDB error');
      dynamoDbMock.put.mockReturnValue({
        promise: jest.fn().mockRejectedValue(mockError),
      } as any);

      await expect(pedidoCacheRepository.adicionarPedidoCache(mockPedido)).rejects.toThrow(
        `Não foi possível adicionar o pedido ao cache: ${mockError.message}`
      );
    });
  });

  describe('removerPedidoCache', () => {
    it('deve remover um pedido do cache', async () => {
      const mockId = '1';
      dynamoDbMock.delete.mockReturnValue({
        promise: jest.fn().mockResolvedValue(undefined),
      } as any);

      await pedidoCacheRepository.removerPedidoCache(mockId);

      expect(dynamoDbMock.delete).toHaveBeenCalledWith({
        TableName: 'fiap-self-service-pedidos-ativos',
        Key: { id: mockId },
      });
    });

    it('deve lançar erro ao falhar ao remover um pedido do cache', async () => {
      const mockId = '1';
      const mockError = new Error('DynamoDB error');
      dynamoDbMock.delete.mockReturnValue({
        promise: jest.fn().mockRejectedValue(mockError),
      } as any);

      await expect(pedidoCacheRepository.removerPedidoCache(mockId)).rejects.toThrow(
        `Não foi possível remover o pedido do cache: ${mockError.message}`
      );
    });
  });

  describe('atualizarStatusPedidoCache', () => {
    it('deve atualizar o status de um pedido no cache', async () => {
      const mockId = '1';
      const mockStatus = 'RECEBIDO';
      dynamoDbMock.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue(undefined),
      } as any);

      await pedidoCacheRepository.atualizarStatusPedidoCache(mockId, mockStatus);

      expect(dynamoDbMock.update).toHaveBeenCalledWith({
        TableName: 'fiap-self-service-pedidos-ativos',
        Key: { id: mockId },
        UpdateExpression: 'set #field = :value',
        ExpressionAttributeNames: { '#field': 'status' },
        ExpressionAttributeValues: { ':value': mockStatus },
      });
    });

    it('deve lançar erro ao falhar ao atualizar o status de um pedido no cache', async () => {
      const mockId = '1';
      const mockStatus = 'RECEBIDO';
      const mockError = new Error('DynamoDB error');
      dynamoDbMock.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(mockError),
      } as any);

      await expect(pedidoCacheRepository.atualizarStatusPedidoCache(mockId, mockStatus)).rejects.toThrow(
        `Não foi possível atualizar o pedido no cache: ${mockError.message}`
      );
    });
  });
});
