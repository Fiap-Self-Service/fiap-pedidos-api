import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

const PEDIDO1 = {
  idPagamento: 'pagamento123',
  idCliente: 'cliente1',
  combo: [
    {
      idProduto: 'produto1',
      quantidade: 2,
      valor: 100,
    },
    {
      idProduto: 'produto2',
      quantidade: 1,
      valor: 50,
    },
  ],
};

const PEDIDO_STATUS_UPDATE = {
  status: 'PREPARACAO',
};

describe('Testes de Integração de Pedido', () => {
  let app: INestApplication;
  let pedidoId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Deve cadastrar um pedido', async () => {
    const response = await request(app.getHttpServer())
      .post('/pedidos')
      .send(PEDIDO1)
      .expect(HttpStatus.CREATED);

    pedidoId = response.body.id; // Armazena o ID do pedido criado
    expect(response.body.id).toBeDefined();
  });

  it('Deve atualizar o status do pedido', async () => {
    await request(app.getHttpServer())
      .post('/pedidos')
      .send(PEDIDO1)
      .expect(HttpStatus.CREATED);

    return await request(app.getHttpServer())
      .patch(`/pedidos/${pedidoId}/status`)
      .send(PEDIDO_STATUS_UPDATE)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(response.body.status).toBe(PEDIDO_STATUS_UPDATE.status);
      });
  });

  it('Deve consultar o pedido pelo ID', async () => {
    await request(app.getHttpServer()).post('/pedidos').send(PEDIDO1);

    return await request(app.getHttpServer())
      .get(`/pedidos/${pedidoId}`)
      .send()
      .expect(HttpStatus.OK)
      .then(response => {
        expect(response.body.id).toBe(pedidoId);
        expect(response.body.status).toBe('RECEBIDO'); // Status inicial
      });
  });
});
