import { HttpException, HttpStatus } from "@nestjs/common";
import { ItemPedido } from "./item-pedido";

describe("ItemPedido", () => {
  describe("construtor", () => {
    it("deve criar um ItemPedido válido", () => {
      const itemPedido = new ItemPedido("pedido123", "produto123", 2, 10);

      expect(itemPedido.idPedido).toBe("pedido123");
      expect(itemPedido.idProduto).toBe("produto123");
      expect(itemPedido.quantidade).toBe(2);
      expect(itemPedido.valor).toBe(10);
    });

    it("deve lançar erro se o idPedido for nulo", () => {
      expect(() => new ItemPedido(null, "produto123", 2, 10)).toThrowError(
        new HttpException("Pedido inválido", HttpStatus.BAD_REQUEST)
      );
    });

    it("deve lançar erro se o idProduto for nulo", () => {
      expect(() => new ItemPedido("pedido123", null, 2, 10)).toThrowError(
        new HttpException("Produto inválido", HttpStatus.BAD_REQUEST)
      );
    });

    it("deve lançar erro se a quantidade for menor ou igual a 0", () => {
      expect(() => new ItemPedido("pedido123", "produto123", 0, 10)).toThrowError(
        new HttpException("Quantidade inválida", HttpStatus.BAD_REQUEST)
      );

      expect(() => new ItemPedido("pedido123", "produto123", -1, 10)).toThrowError(
        new HttpException("Quantidade inválida", HttpStatus.BAD_REQUEST)
      );
    });

    it("deve lançar erro se o valor for menor ou igual a 0", () => {
      expect(() => new ItemPedido("pedido123", "produto123", 2, 0)).toThrowError(
        new HttpException("Valor inválido", HttpStatus.BAD_REQUEST)
      );

      expect(() => new ItemPedido("pedido123", "produto123", 2, -10)).toThrowError(
        new HttpException("Valor inválido", HttpStatus.BAD_REQUEST)
      );
    });
  });
});
