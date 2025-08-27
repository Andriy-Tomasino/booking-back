import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BookingsService } from './bookings.service';
import { JwtService } from '@nestjs/jwt';
import { Logger, forwardRef, Inject } from '@nestjs/common'; // Исправлено: Добавлены forwardRef и Inject
import { BookingDocument } from '../common/models/booking.schema';

@WebSocketGateway({ cors: { origin: '*' } })
export class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(BookingsGateway.name);

  constructor(
    @Inject(forwardRef(() => BookingsService)) // Исправлено: Используем forwardRef для BookingsService
    private readonly bookingsService: BookingsService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.log('BookingsGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('No token provided');
      this.logger.log(`Verifying token for client: ${client.id}`);
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub; // Use 'sub' to match JWT payload
      this.logger.log(`Client connected: ${client.id}, User: ${client.data.userId}`);
      client.join(client.data.userId);
    } catch (error) {
      this.logger.error(`Connection failed: ${client.id}, Error: ${(error as any).message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToBookings')
  async handleSubscribeToBookings(client: Socket) {
    try {
      const bookings = await this.bookingsService.getUserBookings(client.data.userId);
      client.emit('bookingsUpdate', bookings);
    } catch (error) {
      this.logger.error(`Subscribe to bookings failed for user ${client.data.userId}: ${(error as any).message}`);
    }
  }

  async notifyBookingUpdate(booking: BookingDocument) {
    this.server.to(booking.userId.toString()).emit('bookingsUpdate', booking);
  }
}