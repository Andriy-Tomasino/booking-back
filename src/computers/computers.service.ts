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

    async getComputerById(id: string): Promise<ComputerDocument> {
    const computer = await this.computerModel.findById(id).exec();
    if (!computer) {
      throw new NotFoundException('Computer with ID not found');
    }
    return computer;
    }

    async getAllComputers(): Promise<ComputerDocument[]> {
      this.logger.log('Fetching all computers');
      return this.computerModel.find().exec();
    }

    async updateComputer(id: string, dto: UpdateComputerDto): Promise<Computer> {
      this.logger.log(`Update computer: ${id}`);
      const compuer = await this.computerModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
      if(!compuer) {
        throw new NotFoundException('Computer with ID not found');
      }
      return compuer;
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
