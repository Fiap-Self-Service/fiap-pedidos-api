import { Injectable } from "@nestjs/common";
import { AtualizarStatusPedidoWebhookUseCase } from "../../use-cases/atualizar-status-pedido-webhook-use-case";
import { PedidoGateway } from "../gateways/pedido-gateway";
import { AtualizarPedidoDTO } from "../../dto/atualizarStatusPedidoDTO";
import { PedidoDTO } from "../../dto/pedidoDTO";

@Injectable()
export class AtualizarStatusPedidoWebhookController {

  constructor(
    private readonly pedidoGateway: PedidoGateway,
    private readonly atualizarStatusPedidoWebhookUseCase: AtualizarStatusPedidoWebhookUseCase
  ) {}

  async execute(
    idPagamento: string,
    atualizarStatusPedidoDTO: AtualizarPedidoDTO
  ): Promise<PedidoDTO> {
    const pedido = await this.atualizarStatusPedidoWebhookUseCase.execute(this.pedidoGateway, idPagamento, atualizarStatusPedidoDTO);
    const adapterPresenter: PedidoDTO = {...pedido};

    return adapterPresenter;
  }
}
