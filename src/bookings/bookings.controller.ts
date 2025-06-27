import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards,} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dtos/create-booking.dto';
import { BookingDocument } from '../common/models/booking.schema';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Request() req, @Body() createBookingDto: CreateBookingDto): Promise<BookingDocument> {
    return this.bookingsService.createBookings(req.user._id, createBookingDto);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateBooking(@Request() req, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<BookingDocument> {
    return this.bookingsService.updateBooking(id, req.user._id, updateBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBooking(@Request() req, @Param('id') id: string): Promise<void>{
    return this.bookingsService.deleteBooking(id, req.user._id);
  }
}
