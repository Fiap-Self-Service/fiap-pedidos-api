import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import assert from 'assert';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { PedidoStatusType } from '../../core/entities/pedido-status-type.enum';
import { log } from 'console';

const nock = require('nock');

let app: INestApplication;
let pedidoDTO;
let response: any;

const PEDIDO1 = {
  combo: [{idProduto: 'produto1', quantidade: 2, valor: 100 }],
};


Before(async () => {
  
  // Simulando API Clientes
  nock('http://fiap-clientes-api.com')
    .get('/clientes/cliente123')
    .reply(200, { id: 'cliente123', nome: 'Cliente Teste' });

  // Simulando API Pagamentos
  nock('http://fiap-pagamentos-api.com')
    .post('/pagamentos')
    .reply(201, { id: 'uuid' });

  // Simulando API Produtos
  nock('http://fiap-produtos-api.com')
    .get('/produtos/produto1')
    .reply(200, PEDIDO1.combo[0]);

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

After(async () => {
  await app.close();
});

Given('que seja informado um pedido válido', async () => {
  pedidoDTO = PEDIDO1;
});

Given('que seja informado um pedido inválido', async () => {
  pedidoDTO = {};
});

Given('que um pedido seja cadastrado com sucesso', async () => {
  response = await request(app.getHttpServer())
    .post('/pedidos')
    .send(PEDIDO1);

    assert.equal(response.status, HttpStatus.CREATED);
});

Given('realizado a busca dos pedidos', async () => {
  response = await request(app.getHttpServer())
    .get('/pedidos/listarPedidos');
}); 

When('o pedido for cadastrado', async () => {
  response = await request(app.getHttpServer())
    .post('/pedidos')
    .send(pedidoDTO);
});

When('alterar o status do pedido', async () => {
  response = await request(app.getHttpServer())
    .patch('/pedidos/' + response.body.id)
    .send({status: PedidoStatusType.PRONTO});
});

Then('o pedido é cadastrado com sucesso', async () => {
  assert.equal(response.status, HttpStatus.CREATED);
});

Then('a requisição deve ser executada com sucesso', async () => {
  assert.equal(response.status, HttpStatus.OK);
});

Then('o sistema retorna um ID válido para o pedido', async () => {
  assert.ok(response.body.id); 
});

Then('uma exceção deve ser informada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST); 
});

Then('o sistema retorna a lista de pedidos', async () => {
  assert.ok(response.body.length > 0); 
});
