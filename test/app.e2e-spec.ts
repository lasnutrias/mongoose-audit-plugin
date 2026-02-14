import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuditPlugin } from '../src/';
import * as constants from './constants';
import { type AppDocument } from './app.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer;
  let security: string;

  beforeAll(async () => {
    // 1. Arrancamos MongoDB en memoria
    mongod = await MongoMemoryServer.create({
      instance: { dbName: constants.db_name },
    });
    security = mongod.getUri(constants.db_name);
  });

  afterAll(async () => {
    await mongod.stop({
      doCleanup: true,
      force: true,
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(security, {
          connectionName: constants.db_name,
          connectionFactory: (connection: Connection) => {
            connection.plugin(AuditPlugin, constants.auditOptions);
            return connection;
          },
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        const body = res.body as AppDocument;
        const createdBy = body[constants.auditOptions.createdBy] as string;
        const updatedBy = body[constants.auditOptions.updatedBy] as string;
        const currentUser = constants.auditOptions.currentUser?.();
        expect(createdBy).toBe(currentUser);
        expect(updatedBy).toBe(currentUser);
      });
  });
});
