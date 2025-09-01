import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dtos/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @Request() req) {
    const userId = req.user.sub; // Assuming JWT payload has 'sub' field with userId
    return this.bookingsService.createBookings(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getUserBookings(@Param('userId') userId: string) {
    return this.bookingsService.getUserBookings(userId);
  }

  @Get('computer/:id')
  getBookingsByComputerId(@Param('id') id: string) {
    return this.bookingsService.getBookingsByComputerId(id);
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Get()
  getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateBooking(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Request() req) {
    const userId = req.user.sub; // Assuming JWT payload has 'sub' field with userId
    return this.bookingsService.updateBooking(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBooking(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const isAdmin = req.user?.role === 'admin';
    const userId = isAdmin ? undefined : req.user?.uid;
    return this.bookingsService.deleteBooking(id, userId, isAdmin);
  }
}