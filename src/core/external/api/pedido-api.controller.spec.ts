import { Test, TestingModule } from '@nestjs/testing';
import { PedidoAPIController } from './pedido-api.controller';
import { CadastrarPedidoController } from '../../adapters/controllers/cadastrar-pedido-controller';
import { ConsultarPedidoPorIdController } from '../../adapters/controllers/consultar-pedido-controller';
import { ListarPedidoController } from '../../adapters/controllers/listar-pedido-controller';
import { ListarPedidoPorIdClienteController } from '../../adapters/controllers/listar-pedido-filtrado-controller';
import { AtualizarStatusPedidoController } from '../../adapters/controllers/atualizar-status-pedido-controller';
import { ListarPedidosAtivosController } from '../../adapters/controllers/listar-pedidos-ativos-controller';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { AtualizarPedidoDTO } from '../../dto/atualizarStatusPedidoDTO';
import { AtualizarStatusPedidoWebhookController } from '../../adapters/controllers/atualizar-status-pedido-webhook-controller';

describe('PedidoAPIController', () => {
  let controller: PedidoAPIController;

  let cadastrarPedidoControllerMock: jest.Mocked<CadastrarPedidoController>;
  let consultarPedidoPorIdControllerMock: jest.Mocked<ConsultarPedidoPorIdController>;
  let listarPedidoControllerMock: jest.Mocked<ListarPedidoController>;
  let listarPedidosAtivosControllerMock: jest.Mocked<ListarPedidosAtivosController>;
  let listarPedidoPorIdClienteControllerMock: jest.Mocked<ListarPedidoPorIdClienteController>;
  let atualizarStatusPedidoControllerMock: jest.Mocked<AtualizarStatusPedidoController>;
  let atualizarStatusPedidoWebhookControllerMock: jest.Mocked<AtualizarStatusPedidoWebhookController>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoAPIController],
      providers: [
        { provide: CadastrarPedidoController, useValue: { execute: jest.fn() } },
        { provide: ConsultarPedidoPorIdController, useValue: { execute: jest.fn() } },
        { provide: ListarPedidoController, useValue: { execute: jest.fn() } },
        { provide: ListarPedidosAtivosController, useValue: { execute: jest.fn() } },
        { provide: ListarPedidoPorIdClienteController, useValue: { execute: jest.fn() } },
        { provide: AtualizarStatusPedidoController, useValue: { execute: jest.fn() } },
        { provide: AtualizarStatusPedidoWebhookController, useValue: { execute: jest.fn() } }
      ],
    }).compile();

    controller = module.get<PedidoAPIController>(PedidoAPIController);

    cadastrarPedidoControllerMock = module.get(CadastrarPedidoController);
    consultarPedidoPorIdControllerMock = module.get(ConsultarPedidoPorIdController);
    listarPedidoControllerMock = module.get(ListarPedidoController);
    listarPedidosAtivosControllerMock = module.get(ListarPedidosAtivosController);
    listarPedidoPorIdClienteControllerMock = module.get(ListarPedidoPorIdClienteController);
    atualizarStatusPedidoControllerMock = module.get(AtualizarStatusPedidoController);
    atualizarStatusPedidoWebhookControllerMock = module.get(AtualizarStatusPedidoWebhookController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('cadastrarPedido', () => {
    it('should call cadastrarPedidoController and return the result', async () => {

      const pedidoDTO: PedidoDTO = {
        id: null,
        idPagamento: '123',
        idCliente: '123456',
        valorTotal: 100,
        dataCriacao: new Date(),
        status: 'RECEBIDO',
        combo: [
          {
            id: null,
            idPedido: null,
            idProduto: '111',
            quantidade: 1,
            valor: 50,
          },
          {
            id: null, 
            idPedido: null, 
            idProduto: '222', 
            quantidade: 2, 
            valor: 25, 
          },
        ],
      };


      cadastrarPedidoControllerMock.execute.mockResolvedValue(pedidoDTO);

      const result = await controller.cadastrarPedido(pedidoDTO);

      expect(cadastrarPedidoControllerMock.execute).toHaveBeenCalledWith(pedidoDTO);
      expect(result).toEqual(pedidoDTO);
    });
  });

  describe('listarPedidos', () => {
    it('should call listarPedidoController and return the result', async () => {
      const pedidos: PedidoDTO[] = [{
        id: null,
        idPagamento: '123',
        idCliente: '123456',
        valorTotal: 100,
        dataCriacao: new Date(),
        status: 'RECEBIDO',
        combo: [
          {
            id: null,
            idPedido: null,
            idProduto: '111',
            quantidade: 1,
            valor: 50,
          },
          {
            id: null, 
            idPedido: null, 
            idProduto: '222', 
            quantidade: 2, 
            valor: 25, 
          },
        ],
      }];

      listarPedidoControllerMock.execute.mockResolvedValue(pedidos);

      const result = await controller.listarPedidos();

      expect(listarPedidoControllerMock.execute).toHaveBeenCalled();
      expect(result).toEqual(pedidos);
    });
  });

  describe('listarPedidosAtivos', () => {
    it('should call listarPedidosAtivosController and return the result', async () => {
      const pedidosAtivos: PedidoDTO[] = [{
        id: null,
        idPagamento: '123',
        idCliente: '123456',
        valorTotal: 100,
        dataCriacao: new Date(),
        status: 'RECEBIDO',
        combo: [
          {
            id: null,
            idPedido: null,
            idProduto: '111',
            quantidade: 1,
            valor: 50,
          },
          {
            id: null, 
            idPedido: null, 
            idProduto: '222', 
            quantidade: 2, 
            valor: 25, 
          },
        ],
      }];

      listarPedidosAtivosControllerMock.execute.mockResolvedValue(pedidosAtivos);

      const result = await controller.listarPedidosAtivos();

      expect(listarPedidosAtivosControllerMock.execute).toHaveBeenCalled();
      expect(result).toEqual(pedidosAtivos);
    });
  });

  describe('consultarPedidoPorId', () => {
    it('should call consultarPedidoPorIdController and return the result', async () => {
      const pedido: PedidoDTO = {
        id: '123',
        idPagamento: '123',
        idCliente: '123456',
        valorTotal: 100,
        dataCriacao: new Date(),
        status: 'RECEBIDO',
        combo: [
          {
            id: null,
            idPedido: null,
            idProduto: '111',
            quantidade: 1,
            valor: 50,
          },
          {
            id: null, 
            idPedido: null, 
            idProduto: '222', 
            quantidade: 2, 
            valor: 25, 
          },
        ],
      };

      consultarPedidoPorIdControllerMock.execute.mockResolvedValue(pedido);

      const result = await controller.consultarPedidoPorId('123');

      expect(consultarPedidoPorIdControllerMock.execute).toHaveBeenCalledWith('123');
      expect(result).toEqual(pedido);
    });
  });

  describe('listarPedidoPorIdCliente', () => {
    it('should call listarPedidoPorIdClienteController and return the result', async () => {
      const pedidos: PedidoDTO[] = [{
        id: null,
        idPagamento: '123',
        idCliente: '456',
        valorTotal: 100,
        dataCriacao: new Date(),
        status: 'RECEBIDO',
        combo: [
          {
            id: null,
            idPedido: null,
            idProduto: '111',
            quantidade: 1,
            valor: 50,
          },
          {
            id: null, 
            idPedido: null, 
            idProduto: '222', 
            quantidade: 2, 
            valor: 25, 
          },
        ],
      }];

      listarPedidoPorIdClienteControllerMock.execute.mockResolvedValue(pedidos);

      const result = await controller.listarPedidoPorIdCliente('456');

      expect(listarPedidoPorIdClienteControllerMock.execute).toHaveBeenCalledWith('456');
      expect(result).toEqual(pedidos);
    });
  });

  describe('atualizarStatusPedido', () => {
    it('should call atualizarStatusPedidoController and return the result', async () => {
      const atualizarPedidoDTO: AtualizarPedidoDTO = { status: 'RECEBIDO' };
      const pedidoAtualizado: PedidoDTO = {
        id: null,
        idPagamento: '123',
        idCliente: '123456',
        valorTotal: 100,
        dataCriacao: new Date(),
        status: 'PRONTO',
        combo: [
          {
            id: null,
            idPedido: null,
            idProduto: '111',
            quantidade: 1,
            valor: 50,
          },
          {
            id: null, 
            idPedido: null, 
            idProduto: '222', 
            quantidade: 2, 
            valor: 25, 
          },
        ],
      };

      atualizarStatusPedidoControllerMock.execute.mockResolvedValue(pedidoAtualizado);

      const result = await controller.atualizarStatusPedido('789', atualizarPedidoDTO);

      expect(atualizarStatusPedidoControllerMock.execute).toHaveBeenCalledWith(
        '789',
        atualizarPedidoDTO,
      );
      expect(result).toEqual(pedidoAtualizado);
    });
  });

  describe('atualizarStatusPedidoWebhook', () => {
    it('should call atualizarStatusPedidoController and return the result', async () => {
      const atualizarPedidoDTO: AtualizarPedidoDTO = { status: 'RECEBIDO' };
      const pedidoAtualizado: PedidoDTO = {
        id: null,
        idPagamento: '123',
        idCliente: '123456',
        valorTotal: 100,
        dataCriacao: new Date(),
        status: 'PRONTO',
        combo: [
          {
            id: null,
            idPedido: null,
            idProduto: '111',
            quantidade: 1,
            valor: 50,
          },
          {
            id: null, 
            idPedido: null, 
            idProduto: '222', 
            quantidade: 2, 
            valor: 25, 
          },
        ],
      };

      atualizarStatusPedidoWebhookControllerMock.execute.mockResolvedValue(pedidoAtualizado);

      const result = await controller.atualizarStatusPedidoWebhook('123', atualizarPedidoDTO);

      expect(atualizarStatusPedidoWebhookControllerMock.execute).toHaveBeenCalledWith(
        '123',
        atualizarPedidoDTO,
      );
      expect(result).toEqual(pedidoAtualizado);
    });
  });
});
