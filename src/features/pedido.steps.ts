import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PedidoDTO } from './../core/dto/pedidoDTO';
import assert from 'assert';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../app.module';

let app: INestApplication;
let pedidoDTO: PedidoDTO;
let response: any;
let idPedidoPesquisa: string;

const PEDIDO1 = {
  idCliente: 'cliente123',
  produtos: [{ idProduto: 'produto123', quantidade: 2, valor: 100 }],
  status: 'Pendente',
  id: null,
  idPagamento: 'pagamento123',
  valorTotal: 200,
  dataCriacao: new Date(),
  combo: []
};

const PEDIDO2 = {
  idCliente: 'cliente124',
  produtos: [{ idProduto: 'produto124', quantidade: 1, valor: 200 }],
  status: 'Pendente',
  id: null,
  idPagamento: 'pagamento124',
  valorTotal: 200,
  dataCriacao: new Date(),
  combo: []
};

Before(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

After(async () => {
  await app.close();
});

Given('que um pedido válido é fornecido', async () => {
  pedidoDTO = PEDIDO1;
});

Given('que o pedido fornecido tem um status inválido', async () => {
  pedidoDTO = { ...PEDIDO1, status: 'StatusInvalido' };
});

Given('que o pedido já foi cadastrado', async () => {
  const responseCadastro = await request(app.getHttpServer())
    .post('/pedidos')
    .send(PEDIDO1);
  pedidoDTO = PEDIDO1;
  idPedidoPesquisa = responseCadastro.body.id;
});

Given('que um pedido com um status "Pendente" foi cadastrado', async () => {
  const responseCadastro = await request(app.getHttpServer())
    .post('/pedidos')
    .send(PEDIDO1);
  idPedidoPesquisa = responseCadastro.body.id;
});

Given('que o id do pedido não existe', async () => {
  idPedidoPesquisa = 'id_inexistente';
});

When('o cliente solicita a atualização do status do pedido', async () => {
  const statusAtualizado = { status: 'Aprovado' };
  response = await request(app.getHttpServer())
    .put(`/pedidos/${idPedidoPesquisa}/status`)
    .send(statusAtualizado);
});

When('o cliente solicita a consulta do pedido pelo ID', async () => {
  response = await request(app.getHttpServer())
    .get(`/pedidos/${idPedidoPesquisa}`)
    .send();
});

Then('o pedido deve ser atualizado com sucesso', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.equal(response.body.status, 'Aprovado');
});

Then('uma exceção informando que o pedido não foi encontrado deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.NOT_FOUND);
  assert.equal(response.body.message, 'Pedido não encontrado.');
});

Then('uma exceção informando que o status é inválido deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'Status inválido');
});

Then('os dados do pedido atualizado devem ser retornados', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.equal(response.body.status, 'Aprovado');
});

Then('uma exceção informando que o ID do pedido não existe deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.NOT_FOUND);
  assert.equal(response.body.message, 'Pedido não encontrado.');
});

Then('os dados do pedido consultado devem ser retornados', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.equal(response.body.id, idPedidoPesquisa);
  assert.equal(response.body.status, 'Pendente');
});
