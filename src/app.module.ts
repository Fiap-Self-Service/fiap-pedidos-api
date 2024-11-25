import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infrastructure/health/health.module';
import { PedidoGateway } from './core/adapters/gateways/pedido-gateway';
import { ConsultarPedidoPorIdController } from './core/adapters/controllers/consultar-pedido-controller';
import { AtualizarStatusPedidoController } from './core/adapters/controllers/atualizar-status-pedido-controller';
import { ListarPedidoController } from './core/adapters/controllers/listar-pedido-controller';
import { ListarPedidoPorIdClienteController } from './core/adapters/controllers/listar-pedido-filtrado-controller';
import { ListarPedidosAtivosController } from './core/adapters/controllers/listar-pedidos-ativos-controller';
import { CadastrarPedidoController } from './core/adapters/controllers/cadastrar-pedido-controller';
import { CadastrarPedidoUseCase } from './core/use-cases/cadastrar-pedido-use-case';
import { AtualizarStatusPedidoUseCase } from './core/use-cases/atualizar-status-pedido-use-case';
import { ConsultarPedidoPorIdUseCase } from './core/use-cases/consultar-pedido-use-case';
import { ListarPedidoUseCase } from './core/use-cases/listar-pedido-use-case';
import { ListarPedidoPorIdClienteUseCase } from './core/use-cases/listar-pedido-filtrado-use-case';
import { ListarPedidosAtivosUseCase } from './core/use-cases/listar-pedidos-ativos-use-case';
import { IPedidoRepository } from './core/external/repository/pedido-repository.interface';
import { PedidoRepository } from './core/external/repository/pedido-repository';
import { PedidoCacheRepository } from './core/external/repository/pedido-cache-repository';
import { DataSource } from 'typeorm';
import { PedidoEntity } from './core/external/repository/pedido.entity';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PedidoAPIController } from './core/external/api/pedido-api.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    DatabaseModule,
  ],
  controllers: [
    // Adapters for pedidos
    PedidoAPIController,
    ConsultarPedidoPorIdController,
    AtualizarStatusPedidoController,
    ListarPedidoController,
    ListarPedidoPorIdClienteController,
    ListarPedidosAtivosController,
    CadastrarPedidoController,
  ],
  exports: [PedidoGateway],
  providers: [
    // Gateways
    PedidoGateway,
    // Use cases
    CadastrarPedidoUseCase,
    AtualizarStatusPedidoUseCase,
    ConsultarPedidoPorIdUseCase,
    ListarPedidoUseCase,
    ListarPedidoPorIdClienteUseCase,
    ListarPedidosAtivosUseCase,
    // External repositories
    {
      provide: IPedidoRepository,
      useClass: PedidoRepository,
    },
    {
      provide: 'PEDIDO_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(PedidoEntity),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PEDIDO_CACHE_REPOSITORY',
      useClass: PedidoCacheRepository,
    },
  ],
})
export class AppModule {}
