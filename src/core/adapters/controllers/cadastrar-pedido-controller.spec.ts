import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarPedidoController } from './cadastrar-pedido-controller';
import { PedidoDTO } from '../../dto/pedidoDTO';
import { PedidoGateway } from '../gateways/pedido-gateway';
import { CadastrarPedidoUseCase } from '../../use-cases/cadastrar-pedido-use-case';
import { PedidoStatusType } from '../../entities/pedido-status-type.enum';

describe('CadastrarPedidoController', () => {
  let controller: CadastrarPedidoController;
  let pedidoGatewayMock: PedidoGateway;
  let cadastrarPedidoUseCaseMock: CadastrarPedidoUseCase;

  beforeEach(async () => {
    pedidoGatewayMock = {
      cadastrarPedido: jest.fn(),
    } as unknown as PedidoGateway;

    cadastrarPedidoUseCaseMock = {
      execute: jest.fn(),
    } as unknown as CadastrarPedidoUseCase;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarPedidoController,
        { provide: PedidoGateway, useValue: pedidoGatewayMock },
        { provide: CadastrarPedidoUseCase, useValue: cadastrarPedidoUseCaseMock },
      ],
    }).compile();

    controller = module.get<CadastrarPedidoController>(CadastrarPedidoController);
  });

  describe('Construtor', () => {
    it('deve instanciar o controlador corretamente', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('execute', () => {
    it('deve cadastrar um pedido com sucesso e retornar o PedidoDTO', async () => {
      const pedido: PedidoDTO = {
        id: null,
        idPagamento: null,
        idCliente: 'cliente123',
        valorTotal: 100.0,
        dataCriacao: new Date(),
        status: PedidoStatusType.RECEBIDO,
        combo: [
          {
            id: 'item123',
            idPedido: 'pedido123',
            idProduto: 'produto123',
            quantidade: 2,
            valor: 50.0,
          },
        ],
      };

      const pedidoCriado: PedidoDTO = {
        ...pedido,
        id: 'pedido123',
        idPagamento: 'pagamento123',
      };

      (cadastrarPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidoCriado);

      const resultado = await controller.execute(pedido);

      expect(resultado).toBeDefined();
      expect(resultado.id).toBe('pedido123');
      expect(resultado.idCliente).toBe('cliente123');
      expect(resultado.valorTotal).toBe(100.0);
      expect(resultado.status).toBe(PedidoStatusType.RECEBIDO);
      expect(resultado.combo.length).toBe(1);
      expect(resultado.combo[0].idProduto).toBe('produto123');
      expect(resultado.combo[0].quantidade).toBe(2);
      expect(resultado.combo[0].valor).toBe(50.0);
    });

    it('deve lançar erro se o UseCase falhar', async () => {
      const pedido: PedidoDTO = {
        id: null,
        idPagamento: null,
        idCliente: 'cliente123',
        valorTotal: 100.0,
        dataCriacao: new Date(),
        status: PedidoStatusType.RECEBIDO,
        combo: [],
      };

      (cadastrarPedidoUseCaseMock.execute as jest.Mock).mockRejectedValue(
        new Error('Erro ao cadastrar pedido')
      );

      await expect(controller.execute(pedido)).rejects.toThrow('Erro ao cadastrar pedido');
    });

    it('deve adaptar o presenter corretamente mesmo com propriedades ausentes', async () => {
      const pedido: PedidoDTO = {
        id: null,
        idPagamento: null,
        idCliente: 'cliente123',
        valorTotal: 100.0,
        dataCriacao: new Date(),
        status: PedidoStatusType.RECEBIDO,
        combo: [],
      };

      const pedidoCriado: PedidoDTO = {
        ...pedido,
        id: 'pedido123',
        idPagamento: null,
      };

      (cadastrarPedidoUseCaseMock.execute as jest.Mock).mockResolvedValue(pedidoCriado);

      const resultado = await controller.execute(pedido);

      expect(resultado).toEqual({
        ...pedidoCriado,
      });
    });
  });
});
