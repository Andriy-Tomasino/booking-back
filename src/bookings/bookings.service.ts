import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../common/models/booking.schema';
import { ComputersService } from '../computers/computers.service';
import { CreateBookingDto, UpdateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    private readonly computersService: ComputersService,
  ) {}

  async createBookings(userId: string, dto: CreateBookingDto): Promise<BookingDocument> {
    const { computerId, startTime, endTime, username, computerName } = dto;

    if (!Types.ObjectId.isValid(computerId)) {
      throw new BadRequestException('Invalid computerId');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      throw new BadRequestException('Invalid startTime or endTime');
    }

    const computer = await this.computersService.getComputerById(computerId);
    if (!computer) {
      throw new NotFoundException(`Computer with ID ${computerId} not found`);
    }

    const overlapping = await this.bookingModel.findOne({
      computer: computer._id,
      status: 'active',
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } },
      ],
    });

    if (overlapping) {
      throw new BadRequestException(
        `Computer is already booked from ${overlapping.startTime} to ${overlapping.endTime}`,
      );
    }

    const booking = new this.bookingModel({
      userId,
      computer: computer._id,
      user: dto.userId,       // <--- сюда
      startTime: start,
      endTime: end,
      status: 'active',
      username,
      computerName,
    });

    return booking.save();
  }

  async getUserBookings(userId: string): Promise<BookingDocument[]> {
    return this.bookingModel.find({ userId, status: 'active' })
      .populate('computer', 'name location')
      .exec();
  }


  async getBookingsByComputerId(computerId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({ computer: computerId, status: 'active' }) // ищем по ObjectId
      .sort({ startTime: 1 })
      .populate('computer', 'name location')
      .exec();
  }


  async getBookingById(id: string): Promise<BookingDocument> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid booking id');
    const booking = await this.bookingModel.findById(id).populate('computer', 'id name location').exec();
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found.`);
    return booking;
  }

  async getAllBookings(): Promise<BookingDocument[]> {
    return this.bookingModel.find().populate('computer', 'id name location').exec();
  }

  async updateBooking(id: string, userId: string, dto: UpdateBookingDto): Promise<BookingDocument> {
    const booking = await this.getBookingById(id);
    if (booking.userId !== userId) throw new BadRequestException('You can only update your own bookings');

    const start = dto.startTime ? new Date(dto.startTime) : booking.startTime;
    const end = dto.endTime ? new Date(dto.endTime) : booking.endTime;
    if (start >= end) throw new BadRequestException('Start time must be before end time');

    const overlapping = await this.bookingModel.findOne({
      id: { $ne: id },
      computer: booking.computer.id,
      status: 'active',
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    if (overlapping) throw new BadRequestException('Computer is already booked during this time');

    booking.startTime = start;
    booking.endTime = end;
    if (dto.status) booking.status = dto.status;
    if (dto.username) booking.username = dto.username;
    if (dto.computerName) booking.computerName = dto.computerName;

    await booking.save();
    return booking;
  }

  async deleteBooking(id: string, userId: string): Promise<void> {
    const booking = await this.getBookingById(id);
    if (booking.userId !== userId) throw new BadRequestException('You can only delete your own bookings');
    await this.bookingModel.findByIdAndDelete(id).exec();
  }

  async isComputerAvailable(computerId: number): Promise<boolean> {
    const now = new Date();
    const overlappingBooking = await this.bookingModel
      .findOne({
        'computer.id': computerId,
        status: 'active',
        startTime: { $lte: now },
        endTime: { $gte: now },
      })
      .exec();

    return !overlappingBooking;
  }
}
