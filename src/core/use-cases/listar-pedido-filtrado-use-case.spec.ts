import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidoPorIdClienteUseCase } from '../use-cases/listar-pedido-filtrado-use-case';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { Pedido } from '../entities/pedido';
import { ItemPedido } from '../entities/item-pedido';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ListarPedidoPorIdClienteUseCase', () => {
  let listarPedidoPorIdClienteUseCase: ListarPedidoPorIdClienteUseCase;
  let pedidoGateway: PedidoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidoPorIdClienteUseCase,
        {
          provide: PedidoGateway,
          useValue: {
            listarPorIdCliente: jest.fn(), // Mockando o método listarPorIdCliente
          },
        },
      ],
    }).compile();

    listarPedidoPorIdClienteUseCase = module.get<ListarPedidoPorIdClienteUseCase>(ListarPedidoPorIdClienteUseCase);
    pedidoGateway = module.get<PedidoGateway>(PedidoGateway);
  });

  describe('execute', () => {
    it('Deve retornar uma lista de pedidos para o cliente', async () => {
      const itemPedido = new ItemPedido('pedido123', 'produto1', 2, 100);
      const pedidos = [
        new Pedido('cliente123', [itemPedido], 'intencaoPagamento123'),
      ];

      (pedidoGateway.listarPorIdCliente as jest.Mock).mockResolvedValue(pedidos); // Simulando pedidos para o cliente

      const resultado = await listarPedidoPorIdClienteUseCase.execute(
        pedidoGateway,
        'cliente123'
      );

      expect(resultado).toEqual(pedidos); // Verificando se os pedidos foram retornados corretamente
      expect(pedidoGateway.listarPorIdCliente).toHaveBeenCalledWith('cliente123'); // Verificando se o método foi chamado com o ID do cliente correto
    });

    it('Deve lançar uma exceção se nenhum pedido for encontrado', async () => {
      (pedidoGateway.listarPorIdCliente as jest.Mock).mockResolvedValue(null); // Simulando nenhum pedido encontrado

      await expect(
        listarPedidoPorIdClienteUseCase.execute(pedidoGateway, 'clienteInvalido')
      ).rejects.toThrowError(
        new HttpException(
          'Nenhum pedido encontrado para esse cliente, verifique o cliente que foi passado.',
          HttpStatus.NOT_FOUND
        )
      );

      expect(pedidoGateway.listarPorIdCliente).toHaveBeenCalledWith('clienteInvalido'); // Verificando se o método foi chamado com o ID do cliente correto
    });

    it('Deve lançar uma exceção se o gateway falhar', async () => {
      (pedidoGateway.listarPorIdCliente as jest.Mock).mockRejectedValue(
        new Error('Erro ao listar pedidos do cliente')
      ); // Simulando erro no gateway

      await expect(
        listarPedidoPorIdClienteUseCase.execute(pedidoGateway, 'cliente123')
      ).rejects.toThrowError('Erro ao listar pedidos do cliente'); // Verificando se o erro foi lançado
    });
  });
});
