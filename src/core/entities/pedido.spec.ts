import { HttpException, HttpStatus } from "@nestjs/common";
import { Pedido } from "./pedido";
import { ItemPedido } from "./item-pedido";
import { PedidoStatusType } from "./pedido-status-type.enum";

describe("Pedido", () => {
  describe("construtor", () => {
    it("deve criar um pedido com status RECEBIDO", () => {
      const mockItemPedido: ItemPedido[] = [
        { idProduto: "1", valor: 10, quantidade: 2 } as ItemPedido,
      ];

      const pedido = new Pedido("cliente1", mockItemPedido, "pagamento123");

      expect(pedido.status).toBe(PedidoStatusType.RECEBIDO);
      expect(pedido.valorTotal).toBe(20); // 10 * 2
      expect(pedido.idPagamento).toBe("pagamento123");
      expect(pedido.idCliente).toBe("cliente1");
      expect(pedido.combo).toEqual(mockItemPedido);
    });

    it("deve lançar erro se o idPagamento for nulo ou vazio", () => {
      const mockItemPedido: ItemPedido[] = [
        { idProduto: "1", valor: 10, quantidade: 2 } as ItemPedido,
      ];

      expect(() => new Pedido("cliente1", mockItemPedido, "")).toThrowError(
        new HttpException(
          "Identificador do pagamento inválido",
          HttpStatus.BAD_REQUEST
        )
      );

      expect(() => new Pedido("cliente1", mockItemPedido, null)).toThrowError(
        new HttpException(
          "Identificador do pagamento inválido",
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it("deve lançar erro se o combo de produtos for nulo ou vazio", () => {
      expect(() => new Pedido("cliente1", [], "pagamento123")).toThrowError(
        new HttpException(
          "Combo de produtos não pode estar vazio",
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it("deve lançar erro se a quantidade de um produto for 0", () => {
      const mockItemPedido: ItemPedido[] = [
        { idProduto: "1", valor: 10, quantidade: 0 } as ItemPedido,
      ];

      expect(() => new Pedido("cliente1", mockItemPedido, "pagamento123")).toThrowError(
        new HttpException(
          "Ops... Informe a quantidade correta para o produto 1",
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it("deve calcular corretamente o valorTotal baseado nas quantidades e valores dos produtos", () => {
      const mockItemPedido: ItemPedido[] = [
        { idProduto: "1", valor: 10, quantidade: 2 } as ItemPedido,
        { idProduto: "2", valor: 15, quantidade: 1 } as ItemPedido,
      ];

      const pedido = new Pedido("cliente1", mockItemPedido, "pagamento123");

      expect(pedido.valorTotal).toBe(35); // (10 * 2) + (15 * 1)
    });
  });
});
