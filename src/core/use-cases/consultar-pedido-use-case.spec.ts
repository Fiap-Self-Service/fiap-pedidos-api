import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarPedidoPorIdUseCase } from './consultar-pedido-use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';

import { IPedidoRepository } from '../external/repository/pedido-repository.interface';
import { IPedidoCacheRepository } from '../external/repository/pedido-cache-repository.interface';

jest.mock('../adapters/gateways/pedido-gateway');

describe('ConsultarPedidoPorIdUseCase', () => {
  let consultarPedidoPorIdUseCase: ConsultarPedidoPorIdUseCase;
  let pedidoGateway: jest.Mocked<PedidoGateway>;
  let pedidoRepositoryMock: jest.Mock;
  let pedidoCacheRepositoryMock: jest.Mock;

  beforeEach(async () => {
    pedidoRepositoryMock = jest.fn(); 
    pedidoCacheRepositoryMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultarPedidoPorIdUseCase,
        PedidoGateway,
        {
          provide: IPedidoRepository,
          useValue: pedidoRepositoryMock,
        },
        {
          provide: IPedidoCacheRepository,
          useValue: pedidoCacheRepositoryMock,
        }
      ],
    }).compile();

    consultarPedidoPorIdUseCase = module.get<ConsultarPedidoPorIdUseCase>(ConsultarPedidoPorIdUseCase);
    pedidoGateway = module.get<jest.Mocked<PedidoGateway>>(PedidoGateway);
  });

  describe('execute', () => {
    it('Deve lançar uma exceção se o pedido não for encontrado', async () => {
      (pedidoGateway.buscarPorIdPedido as jest.Mock).mockResolvedValue(null);

      await expect(consultarPedidoPorIdUseCase.execute(pedidoGateway, 'invalid-id'))
        .rejects
        .toThrowError(new HttpException('Pedido não encontrado, verifique o pedido que foi passado.', HttpStatus.NOT_FOUND));
    });

    it('Deve retornar o pedido quando ele for encontrado', async () => {
      const itemPedido = new ItemPedido('pedido123', 'produto1', 2, 100); 

      const pedido = new Pedido('cliente123', [itemPedido], 'intencaoPagamento123');  

      (pedidoGateway.buscarPorIdPedido as jest.Mock).mockResolvedValue(pedido);  

      const resultado = await consultarPedidoPorIdUseCase.execute(pedidoGateway, 'pedido123');
      expect(resultado).toEqual(pedido);  
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (idPedido vazio)', () => {
      expect(() => new ItemPedido('', 'produto1', 2, 100))
        .toThrowError(new HttpException('Pedido inválido', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (idProduto vazio)', () => {
      expect(() => new ItemPedido('pedido123', '', 2, 100))
        .toThrowError(new HttpException('Produto inválido', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (quantidade <= 0)', () => {
      expect(() => new ItemPedido('pedido123', 'produto1', 0, 100))
        .toThrowError(new HttpException('Quantidade inválida', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (valor <= 0)', () => {
      expect(() => new ItemPedido('pedido123', 'produto1', 2, 0))
        .toThrowError(new HttpException('Valor inválido', HttpStatus.BAD_REQUEST));
    });
  });
});
