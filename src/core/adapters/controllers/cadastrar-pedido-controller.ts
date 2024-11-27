import { Injectable } from "@nestjs/common";
import { PedidoGateway } from "../gateways/pedido-gateway";
import { CadastrarPedidoUseCase } from "../../use-cases/cadastrar-pedido-use-case";
import { PedidoDTO } from "../../dto/pedidoDTO";

@Injectable()
export class CadastrarPedidoController {
  constructor(
    private readonly pedidoGateway: PedidoGateway,
    private readonly cadastrarPedidoUseCase: CadastrarPedidoUseCase
  ) {}

  async execute(pedido: PedidoDTO): Promise<PedidoDTO> {
    const novoPedido = await this.cadastrarPedidoUseCase.execute(
      pedido,
      this.pedidoGateway
    );
    
    const adapterPresenter: PedidoDTO = { ...novoPedido };

    return adapterPresenter;
  }
}