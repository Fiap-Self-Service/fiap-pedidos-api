import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';  // Ajuste o caminho conforme necessário

describe('Testes de Integração de Pedido', () => {
  let app: INestApplication;
  let pedidoId: string;

  const ITEM_PEDIDO1 = {
    idProduto: 'produto1',
    quantidade: 1,
    valor: 100.0,
  };

  const PEDIDO1 = {
    valorTotal: 100.0,
    dataCriacao: new Date(),
    combo: [ITEM_PEDIDO1],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Deve cadastrar um pedido', async () => {
    const response = await request(app.getHttpServer())
      .post('/pedidos')  // Verifique a rota correta
      .send(PEDIDO1)
      .expect(HttpStatus.CREATED);

    pedidoId = response.body.id; // Armazena o ID do pedido criado
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('RECEBIDO');
    expect(response.body.valorTotal).toBe(100.0);
    expect(response.body.combo.length).toBe(1);  // Verifica que o combo foi passado corretamente
  });

  it('Deve atualizar o status do pedido', async () => {
    const novoStatus = { status: 'PREPARACAO' };

    const response = await request(app.getHttpServer())
      .patch(`/pedidos/${pedidoId}`)
      .send(novoStatus)
      .expect(HttpStatus.OK);  // Espera 201 para confirmação de que a atualização foi bem-sucedida

    expect(response.body.status).toBe('PREPARACAO');
  });

  it('Deve consultar o pedido pelo ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/pedidos/${pedidoId}`)
      .expect(HttpStatus.OK);

    expect(response.body.id).toBe(pedidoId);
    expect(response.body.status).toBe('PREPARACAO'); // Status atualizado
  });

  afterAll(async () => {
    await app.close();
  });
});
