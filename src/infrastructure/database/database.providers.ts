import { DataSource, DataSourceOptions } from 'typeorm';
import { DynamoDB } from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const isTestEnv = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'testcucumber';
      const dataSourceConfig: DataSourceOptions = isTestEnv
        ? {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/../../core/**/*.entity{.ts,.js}'],
            synchronize: true,
          }
        : {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
            entities: [__dirname + '/../../core/**/*.entity{.ts,.js}'],
            synchronize: true,
          };

      const dataSource = new DataSource(dataSourceConfig);
      return dataSource.initialize();
    },
  },
  {
    provide: 'CACHE_DATA_SOURCE',
    useFactory: async () => {
      const isDynamoDBLocal = process.env.DYNAMODB_ENDPOINT === 'http://localhost:8000';
      const dynamoDBConfig = new DynamoDB.DocumentClient({
        region: process.env.DYNAMODB_REGION || 'us-east-1',
        endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
        credentials: isDynamoDBLocal
          ? {
              accessKeyId: 'dummy',
              secretAccessKey: 'dummy', 
            }
          : {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              sessionToken: process.env.AWS_SESSION_TOKEN,
            },
      });

      const dynamoDB = new DynamoDB({
        region: process.env.DYNAMODB_REGION || 'us-east-1',
        endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
        credentials: isDynamoDBLocal
          ? {
              accessKeyId: 'dummy',
              secretAccessKey: 'dummy',
            }
          : {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              sessionToken: process.env.AWS_SESSION_TOKEN,
            },
      });

      // Função para criar a tabela, caso não exista
      const createTableIfNotExists = async () => {
        const params = {
          TableName: 'fiap-self-service-pedidos-ativos',
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
          ],
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        };

        try {
          // Verifica se a tabela existe
          await dynamoDB.describeTable({ TableName: 'fiap-self-service-pedidos-ativos' }).promise();
          console.log('Tabela já existe');
        } catch (error) {
          if (error.code === 'ResourceNotFoundException') {
            console.log('Tabela não encontrada, criando tabela...');
            await dynamoDB.createTable(params).promise();
            console.log('Tabela criada com sucesso!');
          } else {
            console.error('Erro ao verificar/CRIAR a tabela:', error);
          }
        }
      };

      await createTableIfNotExists();

      return dynamoDBConfig;
    },
  },
];
