import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';

@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(+id);
  }

  @Post()
  async create(@Body() createCatDto: Partial<Cat>): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: Partial<Cat>): Promise<Cat> {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.catsService.delete(+id);
  }
}
