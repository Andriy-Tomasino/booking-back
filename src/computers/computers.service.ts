import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Computer, ComputerDocument } from '../common/models/computer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SmartOutletService } from '../smart-outlet/smart-outlet.service';
import { CreateComputerDto, UpdateComputerDto } from './dtos/computer.dto';


@Injectable()
export class ComputersService {
  private readonly logger = new Logger(ComputersService.name);

  constructor(
    @InjectModel(Computer.name) private readonly computerModel:Model<ComputerDocument>,
    private readonly smartOutletService:SmartOutletService,
  ) {}

    async createComputer(dto: CreateComputerDto): Promise<ComputerDocument> {
    this.logger.log(`Create computer: ${dto.name}`);
    const computer = new this.computerModel(dto);
    await computer.save();
    return computer;
    }

  async getAllComputers(): Promise<ComputerDocument[]> {
    console.log('[ComputersService] Fetching all computers');
    const computers = await this.computerModel.find().exec();
    console.log('[ComputersService] Computers found:', computers);
    return computers;
  }

  async getComputerById(id: string): Promise<ComputerDocument> {
    console.log('[ComputersService] Fetching computer with id:', id);
    const computer = await this.computerModel.findOne({ id }).exec();
    if (!computer) {
      console.log('[ComputersService] Computer not found:', id);
      throw new NotFoundException(`Computer with id ${id} not found`);
    }
    console.log('[ComputersService] Computer found:', computer);
    return computer;
  }

  async updateComputer(id: string, updateData: Partial<Computer>): Promise<ComputerDocument> {
    console.log('[ComputersService] Updating computer with id:', id, updateData);
    const updatedComputer = await this.computerModel.findOneAndUpdate(
      { id }, // Ищем по полю id
      updateData,
      { new: true }
    ).exec();
    if (!updatedComputer) {
      console.log('[ComputersService] Computer not found for update:', id);
      throw new NotFoundException(`Computer with id ${id} not found`);
    }
    console.log('[ComputersService] Computer updated:', updatedComputer);
    return updatedComputer;
  }

  async deleteComputer(id: string): Promise<void> {
    this.logger.log(`Delete computer: ${id}`);
    const result = await this.computerModel.findByIdAndDelete(id).exec();
    if(!result) {
      throw new NotFoundException('Computer with ID not found');
    }
  }

  async getComputerStatus(id: string): Promise<Computer & { isPoweredOn: boolean}> {
    this.logger.log(`Getting computer status for ${id}`);
    const computer = await this.getComputerById(id);
    const status = await this.smartOutletService.getOutletStatus(computer.outletId);
    return { ...computer.toObject(), isPoweredOn: status.isPoweredOn };
  }
}
