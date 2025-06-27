const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODVkMDZkM2YyNzEzM2VhODhhMzllOTEiLCJpYXQiOjE3NTA5MjcwNTksImV4cCI6MTc1MDkzMDY1OX0.OKdrYV8Kj0vCVqP2MafYKod73koTtzPADvXM3xMBjUc', // Замініть на JWT-токен, отриманий після аутентифікації через Google OAuth
  },
});

socket.on('connect', () => {
  console.log('Підключено до сервера WebSocket');
  socket.emit('subscribeToBookings');
});

socket.on('bookingsUpdate', (data) => {
  console.log('Отримано оновлення бронювань:', JSON.stringify(data, null, 2));
});

socket.on('error', (error) => {
  console.error('Помилка WebSocket:', error);
});

socket.on('connect_error', (error) => {
  console.error('Помилка підключення:', error);
});

socket.on('disconnect', () => {
  console.log('Відключено від сервера WebSocket');
});