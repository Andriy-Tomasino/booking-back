import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ComputersService } from './computers.service';
import { CreateComputerDto, UpdateComputerDto } from './dtos/computer.dto';
import { Computer, ComputerDocument } from '../common/models/computer.schema';

@Controller('computers')
export class ComputersController {
  constructor (private readonly computersService: ComputersService) {}
  @Post()
  createComputer(@Body() createComputerDto: CreateComputerDto): Promise<ComputerDocument> {
    return this.computersService.createComputer(createComputerDto);
  }

  @Get()
  getAllComputers(): Promise<ComputerDocument[]> {
    return this.computersService.getAllComputers();
  }

  @Get(':id')
  getComputerById(@Param('id') id: string): Promise<ComputerDocument> {
    return this.computersService.getComputerById(id);
  }

  @Get(':id/status')
  getComputerStatus(@Param('id') id: string): Promise<Computer & {isPoweredOn: boolean}> {
    return this.computersService.getComputerStatus(id);
  }

  @Patch(':id')
  updateComputer(@Param('id')id: string, @Body() updateComputerDto: UpdateComputerDto) {
    return this.computersService.updateComputer(id, updateComputerDto);
  }

  @Delete(':id')
  deleteComputer(@Param('id') id: string): Promise<void> {
    return this.computersService.deleteComputer(id);
  }
}
