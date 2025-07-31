import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { ComputersService } from './computers.service';
import { CreateComputerDto, UpdateComputerDto } from './dtos/computer.dto';
import { Computer, ComputerDocument } from '../common/models/computer.schema';
import * as admin from 'firebase-admin';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('computers')
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @Post()
  createComputer(@Body() createComputerDto: CreateComputerDto): Promise<ComputerDocument> {
    return this.computersService.createComputer(createComputerDto);
  }

  @Get()
  async findAll(): Promise<Computer[]> {
    return this.computersService.getAllComputers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Computer> {
    try {
      return await this.computersService.getComputerById(id);
    } catch (error) {
      throw new NotFoundException(`Computer with id ${id} not found`);
    }
  }

  @Get(':id/status')
  getComputerStatus(@Param('id') id: string): Promise<Computer & { isPoweredOn: boolean }> {
    return this.computersService.getComputerStatus(id);
  }

  @Patch(':id')
  updateComputer(@Param('id') id: string, @Body() updateComputerDto: UpdateComputerDto) {
    return this.computersService.updateComputer(id, updateComputerDto);
  }

  @Delete(':id')
  deleteComputer(@Param('id') id: string): Promise<void> {
    return this.computersService.deleteComputer(id);
  }
}