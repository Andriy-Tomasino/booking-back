// src/bookings/bookings.service.ts
import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException, forwardRef, Inject } from '@nestjs/common';  // Исправлено: Добавлены forwardRef и Inject
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookingDto, UpdateBookingDto } from './dtos/create-booking.dto';
import { Booking, BookingDocument } from '../common/models/booking.schema';
import { UsersService } from '../users/users.service';
import { ComputersService } from '../computers/computers.service';
import { BookingsGateway } from './bookings.gateway';
import { User } from '../common/models/user.schema';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly usersService: UsersService,
    private readonly computersService: ComputersService,
    @Inject(forwardRef(() => BookingsGateway))
    private readonly bookingsGateway: BookingsGateway,
  ) {
    this.logger.log('BookingsGateway injected successfully');
  }

  async createBookings(userId: string, dto: CreateBookingDto) {
    this.logger.log(`Creating booking for computerId: ${dto.computerId}, userId: ${userId}`);

    // Validate computer
    const computer = await this.computersService.findById(dto.computerId);
    if (!computer) {
      this.logger.error(`Computer with ID ${dto.computerId} not found`);
      throw new NotFoundException(`Computer with ID ${dto.computerId} not found`);
    }

    // Validate user
    this.logger.log(`Finding user with uid: ${userId}`);
    const user = await this.usersService.findByUid(userId);
    if (!user) {
      this.logger.error(`User with UID ${userId} not found`);
      throw new NotFoundException(`User with UID ${userId} not found`);
    }

    // Проверка startTime < endTime
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for overlapping bookings
    const overlappingBookings = await this.bookingModel.find({
      computer: dto.computerId,
      status: 'active',
      $or: [
        {
          startTime: { $lt: end, $gte: start },
        },
        {
          endTime: { $gt: start, $lte: end },
        },
        {
          startTime: { $lte: start },
          endTime: { $gte: end },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      const conflict = overlappingBookings[0];
      this.logger.error(
        `Overlapping booking found: ${JSON.stringify({
          id: conflict._id,
          startTime: conflict.startTime,
          endTime: conflict.endTime,
        })}`,
      );
      throw new ConflictException('The selected time slot is already booked');
    }

    // Create booking
    try {
      const booking = new this.bookingModel({
        userId: userId,
        user: user._id,
        computer: computer._id,
        startTime: start,
        endTime: end,
        status: 'active',
        username: user.nickname || user.firstName || 'Невідомий користувач',
        computerName: computer.name,         // ✅ вместо dto.computerName
        locationName: computer.location,
      });

      this.logger.log(`Booking object before save: ${JSON.stringify(booking)}`);

      const createdBooking = await booking.save();
      this.logger.log(`Booking created: ${JSON.stringify(createdBooking)}`);

      await this.bookingsGateway.notifyBookingUpdate(createdBooking);

      return createdBooking;
    } catch (error) {
      this.logger.error(`Booking creation failed: ${(error as any).message}`);
      throw new ConflictException('Failed to create booking');
    }
  }

  async getUserBookings(userId: string) {
    const user = await this.usersService.findByUid(userId);
    if (!user) {
      throw new NotFoundException(`User with UID ${userId} not found`);
    }
    return this.bookingModel.find({ userId }).exec();
  }

  // src/bookings/bookings.service.ts

  async getBookingsByComputerId(computerId: string) {
    const objectId = new Types.ObjectId(computerId);

    const bookings = await this.bookingModel
      .find({ computer: objectId })
      .populate('user', 'nickname username email firstName lastName') // ⚡️ тянем всё что может пригодиться
      .exec();

    const formattedBookings = bookings.map(b => {
      const user: any = b.user; // user после populate уже объект, но TypeScript видит ObjectId
      let displayName = 'Користувач';

      if (user) {
        displayName =
          user.nickname ||
          user.username ||
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user.email ||
          b.username || // то что ты сохраняешь в booking
          'Користувач';
      }

      return {
        _id: b._id,
        userId: b.userId,
        username: displayName,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
        computerName: b.computerName,
        locationName: b.locationName,
      };
    });

    return formattedBookings;
  }




  async getBookingById(id: string) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async getAllBookings() {
    return this.bookingModel
      .find()
      .populate('computer', 'name location') // подтягиваем имя и локацию компьютера
      .populate('user', 'username nickname firstName lastName') // подтягиваем данные пользователя
      .exec();
  }

  async updateBooking(id: string, userId: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const user = await this.usersService.findByUid(userId);
    if (!user || booking.user.toString() !== user._id.toString()) {
      throw new NotFoundException('Booking does not belong to this user');
    }

    if (updateBookingDto.startTime || updateBookingDto.endTime) {
      const newStart = new Date(updateBookingDto.startTime || booking.startTime.toISOString());
      const newEnd = new Date(updateBookingDto.endTime || booking.endTime.toISOString());
      if (newStart >= newEnd) {
        throw new BadRequestException('Start time must be before end time');
      }

      const overlappingBookings = await this.bookingModel.find({
        computer: booking.computer,
        status: 'active',
        _id: { $ne: id },
        $or: [
          {
            startTime: {
              $lt: newEnd,
              $gte: newStart,
            },
          },
          {
            endTime: {
              $gt: newStart,
              $lte: newEnd,
            },
          },
          {
            startTime: { $lte: newStart },
            endTime: { $gte: newEnd },
          },
        ],
      });

      if (overlappingBookings.length > 0) {
        throw new ConflictException('The updated time slot is already booked');
      }
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();

    if (!updatedBooking) {
      throw new NotFoundException(`Failed to update booking with ID ${id}`);
    }

    await this.bookingsGateway.notifyBookingUpdate(updatedBooking);

    return updatedBooking;
  }

  async deleteBooking(id: string, userId?: string, isAdmin = false) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);

    if (!isAdmin) {
      if (!userId) throw new BadRequestException('User ID is required');
      const user = await this.usersService.findByUid(userId);
      if (!user || booking.user.toString() !== user._id.toString()) {
        throw new NotFoundException('Booking does not belong to this user');
      }
    }

    await this.bookingModel.findByIdAndDelete(id).exec();
    return { message: 'Booking deleted' };
  }


}