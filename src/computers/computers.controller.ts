import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
  async getAllComputers(@Req() request: any): Promise<ComputerDocument[]> {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Missing or invalid Authorization header');
      }
      const idToken = authHeader.split('Bearer ')[1];
      console.log('[ComputersController] Verifying idToken:', idToken);
      await admin.auth().verifyIdToken(idToken);
      return this.computersService.getAllComputers();
    } catch (error: any) {
      console.error('[ComputersController] Error:', error);
      throw new HttpException(
        { message: 'Unauthorized', error: error.message || 'Unknown error', statusCode: 401 },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get(':id')
  getComputerById(@Param('id') id: string): Promise<ComputerDocument> {
    return this.computersService.getComputerById(id);
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