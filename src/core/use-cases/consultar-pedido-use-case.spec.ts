import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarPedidoPorIdUseCase } from './consultar-pedido-use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';

describe('ConsultarPedidoPorIdUseCase', () => {
  let consultarPedidoPorIdUseCase: ConsultarPedidoPorIdUseCase;
  let pedidoGateway: PedidoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultarPedidoPorIdUseCase,
        PedidoGateway
      ],
    }).compile();

    consultarPedidoPorIdUseCase = module.get<ConsultarPedidoPorIdUseCase>(ConsultarPedidoPorIdUseCase);
    pedidoGateway = module.get<PedidoGateway>('PedidoGateway');  // Obtendo a instância do PedidoGateway
  });

  describe('execute', () => {
    it('Deve lançar uma exceção se o pedido não for encontrado', async () => {
      (pedidoGateway.buscarPorIdPedido as jest.Mock).mockResolvedValue(null);  // Simulação de pedido não encontrado

      await expect(consultarPedidoPorIdUseCase.execute(pedidoGateway, 'invalid-id'))
        .rejects
        .toThrowError(new HttpException('Pedido não encontrado, verifique o pedido que foi passado.', HttpStatus.NOT_FOUND));
    });

    it('Deve retornar o pedido quando ele for encontrado', async () => {
      const itemPedido = new ItemPedido('pedido123', 'produto1', 2, 100);  // Criando o ItemPedido corretamente

      const pedido = new Pedido('cliente123', [itemPedido], 'intencaoPagamento123');  // Instanciando o Pedido com o ItemPedido

      (pedidoGateway.buscarPorIdPedido as jest.Mock).mockResolvedValue(pedido);  // Simulação de pedido encontrado

      const resultado = await consultarPedidoPorIdUseCase.execute(pedidoGateway, 'pedido123');
      expect(resultado).toEqual(pedido);  // Verificando se o pedido retornado é o esperado
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (idPedido vazio)', () => {
      expect(() => new ItemPedido('', 'produto1', 2, 100))  // Passando idPedido inválido
        .toThrowError(new HttpException('Pedido inválido', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (idProduto vazio)', () => {
      expect(() => new ItemPedido('pedido123', '', 2, 100))  // Passando idProduto inválido
        .toThrowError(new HttpException('Produto inválido', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (quantidade <= 0)', () => {
      expect(() => new ItemPedido('pedido123', 'produto1', 0, 100))  // Passando quantidade inválida
        .toThrowError(new HttpException('Quantidade inválida', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar uma exceção se o ItemPedido for inválido (valor <= 0)', () => {
      expect(() => new ItemPedido('pedido123', 'produto1', 2, 0))  // Passando valor inválido
        .toThrowError(new HttpException('Valor inválido', HttpStatus.BAD_REQUEST));
    });
  });
});