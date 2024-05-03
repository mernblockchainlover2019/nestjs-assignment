import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(Cat),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        }
      ],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result: Cat[] = [
        {
          id: 1,
          age: 2,
          breed: 'Bombay',
          name: 'Pixel',
        },
      ];
      jest.spyOn(catsService, 'findAll').mockResolvedValue(result);

      expect(await catsController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a cat', async () => {
      const catId = '1';
      const result: Cat = {
        id: 1,
        age: 2,
        breed: 'Bombay',
        name: 'Pixel',
      };
      jest.spyOn(catsService, 'findOne').mockResolvedValue(result);

      expect(await catsController.findOne(catId)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a cat', async () => {
      const createCatDto: Partial<Cat> = {
        age: 2,
        breed: 'Bombay',
        name: 'Pixel',
      };
      const createdCat: any = {
        id: 1,
        ...createCatDto,
      };
      jest.spyOn(catsService, 'create').mockResolvedValue(createdCat);

      expect(await catsController.create(createCatDto)).toBe(createdCat);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const catId = '1';
      const updateCatDto: Partial<Cat> = {
        age: 3,
        breed: 'Persian',
        name: 'Whiskers',
      };
      const updatedCat: any = {
        id: 1,
        ...updateCatDto,
      };
      jest.spyOn(catsService, 'update').mockResolvedValue(updatedCat);

      expect(await catsController.update(catId, updateCatDto)).toBe(updatedCat);
    });
  });

  describe('remove', () => {
    it('should remove a cat', async () => {
      const catId = '1';
      jest.spyOn(catsService, 'delete').mockResolvedValue(undefined);

      expect(await catsController.remove(catId)).toBeUndefined();
    });
  });
});