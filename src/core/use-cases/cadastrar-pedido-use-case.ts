import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Pedido } from "../entities/pedido";
import { PedidoGateway } from "../adapters/gateways/pedido-gateway";
import { fiapClientesApiClient } from "../external/integration/fiap-clientes-api.client";
import { fiapProdutosApiClient } from "../external/integration/fiap-produtos-api.client";
import { fiapPagamentosApiClient } from "../external/integration/fiap-pagamentos-api.client";
@Injectable()
export class CadastrarPedidoUseCase {
  async execute(
    pedido: Pedido,
    pedidoGateway: PedidoGateway,
  ): Promise<Pedido> {
    // Validação do combo de produtos
    if (!pedido.combo || pedido.combo.length === 0) 
    {
      throw new HttpException('Combo de produtos não pode estar vazio', HttpStatus.BAD_REQUEST);
    }
          
    // Verifica se o cliente optou por se identificar e se o ID é válido
    if (pedido.idCliente && (await fiapClientesApiClient.adquirirPorID(pedido.idCliente)) == null) 
    {
      throw new HttpException("Cliente não encontrado.", HttpStatus.BAD_REQUEST);
    }

    let valorTotal = 0;
    // Verifica os itens do combo
    for (let item of pedido.combo) 
    {
      const produto = await fiapProdutosApiClient.buscarProdutoPorID(item.idProduto);

      if (!produto) {
        throw new HttpException(
          "Ops... o produto " + item.idProduto + " não foi encontrado.",
          HttpStatus.BAD_REQUEST
        );
      }

      // Atualiza o valor do item com o preço do produto
      item.valor = produto.valor;
      valorTotal += Number(item.valor) * Number(item.quantidade);
    }

    // Criação da intenção de pagamento com mock
    const intencaoPagamento = await fiapPagamentosApiClient.gerarPagamento(valorTotal);

    // Criação do novo pedido
    const novoPedido = new Pedido(
      pedido.idCliente,
      pedido.combo,
      intencaoPagamento.id
    );

    // Salva o pedido no repositório mockado
    const result = await pedidoGateway.salvarPedido(novoPedido);

    // Adiciona o pedido ao cache com mock
    await pedidoGateway.adicionarPedidoCache(result);

    return result;
  }
}
