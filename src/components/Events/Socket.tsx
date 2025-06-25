import io  from 'socket.io-client';

export interface LiveLocationUpdate {
  eventId: string;
  coordinates: [number, number];
  timestamp: string;
}

let socket: ReturnType<typeof io> | null = null;

export function connectSocket({
  eventId,
  onLocationUpdate,
}: {
  eventId: string;
  onLocationUpdate: (data: LiveLocationUpdate) => void;
}) {
  if (!socket) {
    socket = io('https://your-socket-server-url.com', {
      transports: ['websocket'],
      reconnectionAttempts: 3,
    });
  }

  socket.on('connect', () => {
    console.log('Connected to socket:', socket?.id);
    socket?.emit('joinEventRoom', { eventId });
  });

  socket.on('liveLocationUpdate', onLocationUpdate);

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (err:unknown) => {
    console.error('Socket error:', err);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
