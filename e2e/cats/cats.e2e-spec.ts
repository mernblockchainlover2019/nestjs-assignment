import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CatsService } from '../../src/cats/cats.service';
import { AppModule } from '../../src/app.module';

describe('Cats', () => {
  const catsService = { 
    findAll: () => ['test'],
    findOne: (id: number) => ({ id, name: 'Test Cat' }),
    create: (cat: any) => ({ id: 1, ...cat }),
    update: (id: number, cat: any) => ({ id, ...cat }),
    delete: (id: number) => Promise.resolve(),
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: catsService.findAll(),
    });
  });

  it(`/GET cats/:id`, () => {
    const id = 1;
    return request(app.getHttpServer()).get(`/cats/${id}`).expect(200).expect({
      data: catsService.findOne(id),
    });
  });

  it(`/POST cats`, () => {
    const catData = { name: 'New Cat' };
    return request(app.getHttpServer())
      .post('/cats')
      .send(catData)
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.name).toEqual(catData.name);
      });
  });

  it(`/PUT cats/:id`, () => {
    const id = 1;
    const updatedCatData = { name: 'Updated Cat' };
    return request(app.getHttpServer())
      .put(`/cats/${id}`)
      .send(updatedCatData)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('id', id);
        expect(res.body.data.name).toEqual(updatedCatData.name);
      });
  });

  it(`/DELETE cats/:id`, () => {
    const id = 1;
    return request(app.getHttpServer())
      .delete(`/cats/${id}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
