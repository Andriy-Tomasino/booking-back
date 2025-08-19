import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ComputersService } from './computers.service';
import { CreateComputerDto, UpdateComputerDto } from './dtos/computer.dto';

@Controller('computers')
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @Post()
  create(@Body() dto: CreateComputerDto) {
    return this.computersService.createComputer(dto);
  }

  @Get()
  getAll() {
    return this.computersService.getAllComputers();
  }

  @Get(':id')
  getComputer(@Param('id') id: string) { // ✅ string
    return this.computersService.getComputerById(id);
  }

  @Patch(':id')
  updateComputer(@Param('id') id: string, @Body() dto: UpdateComputerDto) {
    return this.computersService.updateComputer(id, dto);
  }

  @Delete(':id')
  deleteComputer(@Param('id') id: string) {
    return this.computersService.deleteComputer(id);
  }

}
