import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Computer, ComputerDocument } from '../common/models/computer.schema';
import { CreateComputerDto, UpdateComputerDto } from './dtos/computer.dto';

@Injectable()
export class ComputersService {
  constructor(@InjectModel(Computer.name) private readonly computerModel: Model<ComputerDocument>) {}

  async findById(id: string): Promise<ComputerDocument> {
    const computer = await this.computerModel.findById(id).exec();
    if (!computer) {
      throw new NotFoundException(`Computer with ID ${id} not found`);
    }
    return computer;
  }

  async createComputer(dto: CreateComputerDto): Promise<ComputerDocument> {
    const computer = new this.computerModel(dto);
    return computer.save();
  }

  async getAllComputers(): Promise<ComputerDocument[]> {
    return this.computerModel.find().populate('bookings').exec();
  }

  async getComputerById(id: string) {
    return this.computerModel.findById(id).populate('bookings').exec();
  }


  async updateComputer(id: string, dto: UpdateComputerDto) {
    const computer = await this.getComputerById(id);
    if (!computer) throw new NotFoundException(`Computer with ID ${id} not found`);

    Object.assign(computer, dto); // ✅ теперь computer точно не null
    return computer.save();
  }


  async deleteComputer(id: string) {
    const computer = await this.getComputerById(id);
    if (!computer) throw new NotFoundException(`Computer with ID ${id} not found`);

    await this.computerModel.findByIdAndDelete(computer._id).exec();
  }

}
