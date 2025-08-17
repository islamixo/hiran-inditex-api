import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /tasks -> crea tarea', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ input: 'https://picsum.photos/seed/nest/1200/800' })
      .expect(201);

    expect(res.body.taskId).toBeDefined();
    expect(res.body.status).toBe('pending');
    expect(typeof res.body.price).toBe('number');

    const taskId = res.body.taskId;

    // Polling simple
    let body: any = res.body;
    for (let i = 0; i < 10; i++) {
      const r = await request(app.getHttpServer()).get(`/tasks/${taskId}`).expect(200);
      body = r.body;
      if (body.status !== 'pending') break;
      await new Promise((res) => setTimeout(res, 300));
    }

    expect(['completed', 'failed']).toContain(body.status);
    if (body.status === 'completed') {
      expect(Array.isArray(body.images)).toBe(true);
      expect(body.images.length).toBe(2);
    }
  });

  it('GET /tasks/:id inexistente -> 404', async () => {
    await request(app.getHttpServer()).get('/tasks/66aaaaaaaaaaaaaaaaaaaaaa').expect(404);
  });
});
