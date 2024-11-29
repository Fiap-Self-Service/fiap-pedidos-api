import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarPedidoUseCase } from './cadastrar-pedido-use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Pedido } from '../entities/pedido';
import { PedidoGateway } from '../adapters/gateways/pedido-gateway';
import { fiapClientesApiClient } from '../external/integration/fiap-clientes-api.client';
import { fiapProdutosApiClient } from '../external/integration/fiap-produtos-api.client';
import { fiapPagamentosApiClient } from '../external/integration/fiap-pagamentos-api.client';
import { ItemPedido } from '../entities/item-pedido';
import { PedidoDTO } from '../dto/pedidoDTO';

jest.mock('../external/integration/fiap-clientes-api.client');
jest.mock('../external/integration/fiap-produtos-api.client');
jest.mock('../external/integration/fiap-pagamentos-api.client');
jest.mock('../adapters/gateways/pedido-gateway');

describe('CadastrarPedidoUseCase', () => {
  let cadastrarPedidoUseCase: CadastrarPedidoUseCase;
  let pedidoGatewayMock: PedidoGateway;

  beforeEach(async () => {
    // Cria o módulo de teste, incluindo o mock do PedidoGateway diretamente
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarPedidoUseCase,
        {
          provide: PedidoGateway,
          useValue: {
            salvarPedido: jest.fn(),
            adicionarPedidoCache: jest.fn(),
          },
        },
      ],
    }).compile();

    cadastrarPedidoUseCase = module.get<CadastrarPedidoUseCase>(CadastrarPedidoUseCase);
    pedidoGatewayMock = module.get<PedidoGateway>(PedidoGateway);
  });

  it('deve lançar erro quando o combo de produtos estiver vazio', async () => {
    const pedido = { idCliente: 'cliente1', combo: [], idPagamento: 'intencaoPagamento1'};
    
    await expect(cadastrarPedidoUseCase.execute(pedido as PedidoDTO, pedidoGatewayMock))
      .rejects
      .toThrowError(new HttpException('Combo de produtos não pode estar vazio', HttpStatus.BAD_REQUEST));
  });

  it('deve lançar erro quando o cliente não for encontrado', async () => {
    const pedido = new Pedido('cliente1', [{ idProduto: 'produto1', quantidade: 1 } as ItemPedido], 'intencaoPagamento1');
    fiapClientesApiClient.adquirirPorID = jest.fn().mockResolvedValue(null);

    await expect(cadastrarPedidoUseCase.execute(pedido, pedidoGatewayMock))
      .rejects
      .toThrowError(new HttpException("Cliente não encontrado.", HttpStatus.BAD_REQUEST));
  });

  it('deve lançar erro quando o produto não for encontrado', async () => {
    const pedido = new Pedido('cliente1', [{ idProduto: 'produto1', quantidade: 1 } as ItemPedido], 'intencaoPagamento1');
    fiapClientesApiClient.adquirirPorID = jest.fn().mockResolvedValue({ id: 'cliente1' });
    fiapProdutosApiClient.buscarProdutoPorID = jest.fn().mockResolvedValue(null);

    await expect(cadastrarPedidoUseCase.execute(pedido, pedidoGatewayMock))
      .rejects
      .toThrowError(new HttpException("Ops... o produto produto1 não foi encontrado.", HttpStatus.BAD_REQUEST));
  });

  it('deve calcular o valor total corretamente e salvar o pedido', async () => {
    const pedido = { idCliente: 'cliente1', combo: [{ idProduto: 'produto1', quantidade: 2, valor: 50 } as ItemPedido,
      { idProduto: 'produto2', quantidade: 1, valor: 100 } as ItemPedido,], idPagamento: 'intencaoPagamento1'};

    fiapClientesApiClient.adquirirPorID = jest.fn().mockResolvedValue({ id: 'cliente1' });
    fiapProdutosApiClient.buscarProdutoPorID = jest.fn()
      .mockResolvedValueOnce({ id: 'produto1', valor: 50 })
      .mockResolvedValueOnce({ id: 'produto2', valor: 100 });
    fiapPagamentosApiClient.gerarPagamento = jest.fn().mockResolvedValue({ id: 'pagamento123' });
    pedidoGatewayMock.salvarPedido = jest.fn().mockResolvedValue(pedido);
    pedidoGatewayMock.adicionarPedidoCache = jest.fn().mockResolvedValue(undefined);

    const resultado = await cadastrarPedidoUseCase.execute(pedido as Pedido, pedidoGatewayMock);

    expect(resultado).toEqual(pedido);
    expect(fiapPagamentosApiClient.gerarPagamento).toHaveBeenCalledWith(200);
    expect(pedidoGatewayMock.adicionarPedidoCache).toHaveBeenCalledWith(pedido);
  });

  it('deve lançar erro quando a intenção de pagamento falhar', async () => {

    const pedido = { idCliente: 'cliente1', combo: [{ idProduto: 'produto1', quantidade: 2, valor: 50 } as ItemPedido], idPagamento: 'intencaoPagamento1'};

    fiapClientesApiClient.adquirirPorID = jest.fn().mockResolvedValue({ id: 'cliente1' });
    fiapProdutosApiClient.buscarProdutoPorID = jest.fn().mockResolvedValue({ id: 'produto1', valor: 50 });
    fiapPagamentosApiClient.gerarPagamento = jest.fn().mockRejectedValue(new Error('Erro ao gerar pagamento'));

    await expect(cadastrarPedidoUseCase.execute(pedido as PedidoDTO, pedidoGatewayMock))
      .rejects
      .toThrowError(new HttpException('Erro ao gerar pagamento', HttpStatus.INTERNAL_SERVER_ERROR));
  });
});
