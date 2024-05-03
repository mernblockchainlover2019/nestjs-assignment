import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>,
  ) {}

  async findAll(): Promise<Cat[]> {
    return await this.catsRepository.find();
  }

  async findOne(id: number): Promise<Cat> {
    const cat = await this.catsRepository.findOne({where: {id}});
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    return cat;
  }

  async create(cat: Partial<Cat>): Promise<Cat> {
    const newCat = this.catsRepository.create(cat);
    return await this.catsRepository.save(newCat);
  }

  async update(id: number, updateCatDto: Partial<Cat>): Promise<Cat> {
    const cat = await this.findOne(id);
    Object.assign(cat, updateCatDto);
    return await this.catsRepository.save(cat);
  }

  async delete(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.catsRepository.remove(cat);
  }
}
