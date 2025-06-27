import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BookingsService } from './bookings.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { BookingDocument } from '../common/models/booking.schema';

@WebSocketGateway({ cors: { origin: '*' } })
export class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(BookingsGateway.name);

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      this.logger.log(`Client connected: ${client.id}, User: ${client.data.userId}`);
    } catch (error) {
      this.logger.error(`Connection failed: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToBookings')
  async handleSubscribeToBookings(client: Socket) {
    const bookings = await this.bookingsService.getUserBookings(client.data.userId);
    client.emit('bookingsUpdate', bookings);
  }

  async notifyBookingUpdate(booking: BookingDocument) {
    this.server.emit('bookingsUpdate', booking);
  }
}