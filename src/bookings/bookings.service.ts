import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../common/models/booking.schema';
import { ComputersService } from '../computers/computers.service';
import { CreateBookingDto, UpdateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    private readonly computersService: ComputersService,
  ) {
    console.log('BookingModel:', bookingModel);
  }

  async createBookings(userId: string, dto: CreateBookingDto): Promise<BookingDocument> {
    const { computerId, startTime, endTime } = dto;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new BadRequestException('Start date must be less than end date.');
    }

    const computer = await this.computersService.getComputerById(computerId);
    if (!computer.isAvailable) {
      throw new BadRequestException('Computer not found.');
    }

    const overlappingBooking = await this.bookingModel.findOne({
      computerId,
      status: 'active',
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    })
      .exec();

    if (overlappingBooking) {
      throw new BadRequestException('Computer is already booked for this time slot');
    }

    const booking = new this.bookingModel({
      userId,
      computerId,
      startTime: start,
      endTime: end,
      status: 'active',
    });

    await this.computersService.updateComputer(computerId, { isAvailable: false });
    await booking.save();
    return booking;
  }

  async getBookingById(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('userId', 'email name')
      .populate('computerId', 'name location')
      .exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }
    return booking;
  }

  async getUserBookings(userId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({ userId })
      .populate('computerId', 'name location')
      .exec();
  }

  async getAllBookings(): Promise<BookingDocument[]> {
    return this.bookingModel
      .find()
      .populate('computerId', 'name location')
      .exec();
  }

  async updateBooking(id: string, userId: string, dto: UpdateBookingDto): Promise<BookingDocument> {
    const booking = await this.getBookingById(id);
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException(`You can only update your own bookings`);
    }

    if (dto.startTime || dto.endTime) {
      const start = dto.startTime ? new Date(dto.startTime) : booking.startTime;
      const end = dto.endTime ? new Date(dto.endTime) : booking.endTime;

      if (start >= end) {
        throw new BadRequestException(`Start date must be less than end date.`);
      }

      const overlappingBooking = await this.bookingModel
        .findOne({
          computerId: booking.computerId,
          status: 'active',
          _id: { $ne: id },
          $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } },
          ],
        })
        .exec();

      if (overlappingBooking) {
        throw new BadRequestException(`You can only update your own bookings`);
      }
      booking.startTime = start;
      booking.endTime = end;
    }

    if (dto.status) {
      booking.status = dto.status;
      if (dto.status === 'completed' || dto.status === 'cancelled') {
        await this.computersService.updateComputer(booking.computerId.toString(), { isAvailable: true });
      }
    }

    await booking.save();
    return booking;
  }

  async deleteBooking(id: string, userId: string): Promise<void> {
    const booking = await this.getBookingById(id);
    if (booking.userId.toString() !== userId){
      throw new BadRequestException(`You can only delete your own bookings`);
    }

    await this.computersService.updateComputer(booking.computerId.toString(), { isAvailable: true });
    await this.bookingModel.findByIdAndDelete(id).exec();
  }
}
