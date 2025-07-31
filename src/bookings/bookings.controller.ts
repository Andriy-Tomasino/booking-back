import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dtos/create-booking.dto';
import { BookingDocument } from '../common/models/booking.schema';
import * as admin from 'firebase-admin';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Request() req, @Body() createBookingDto: CreateBookingDto): Promise<BookingDocument> {
    return this.bookingsService.createBookings(req.user._id, createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBookingsByComputerId(@Query('computerId') computerId: string) {
    console.log('[BookingsController] Fetching bookings for computerId:', computerId);
    return this.bookingsService.getBookingsByComputerId(computerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserBooking(@Request() req): Promise<BookingDocument[]> {
    return this.bookingsService.getUserBookings(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllBookings(): Promise<BookingDocument[]> {
    return this.bookingsService.getAllBookings();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBookingById(@Param('id') id: string): Promise<BookingDocument> {
    return this.bookingsService.getBookingById(id);
  }

  @Get('next/:computerId')
  async getNextBookingByComputerId(@Request() req, @Param('computerId') computerId: string): Promise<BookingDocument | null> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Missing or invalid Authorization header');
      }
      const idToken = authHeader.split('Bearer ')[1];
      console.log('[BookingsController] Verifying idToken for next booking:', idToken);
      await admin.auth().verifyIdToken(idToken);
      return this.bookingsService.getNextBookingByComputerId(computerId);
    } catch (error: any) {
      console.error('[BookingsController] Error:', error);
      throw new HttpException(
        { message: 'Unauthorized', error: error.message || 'Unknown error', statusCode: 401 },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateBooking(@Request() req, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<BookingDocument> {
    return this.bookingsService.updateBooking(id, req.user._id, updateBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBooking(@Request() req, @Param('id') id: string): Promise<void> {
    return this.bookingsService.deleteBooking(id, req.user._id);
  }
}