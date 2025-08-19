import { Controller, Post, Body, Param, Get, Delete, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dtos/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    // В реальном приложении userId можно брать из JWT
    const userId = 'admin';
    return this.bookingsService.createBookings(userId, dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.bookingsService.getUserBookings(userId);
  }

  @Get('all')
  getAll() {
    return this.bookingsService.getAllBookings();
  }

  @Get('computer/:id')
  getByComputer(@Param('id') id: string) {
    return this.bookingsService.getBookingsByComputerId(id); // id как ObjectId
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    const userId = 'admin';
    return this.bookingsService.updateBooking(id, userId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const userId = 'admin';
    return this.bookingsService.deleteBooking(id, userId);
  }
}
