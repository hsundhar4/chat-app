const io = socketIO(server, {
  cors: {
    origin: true, // Automatically reflects the request origin
    methods: ['GET', 'POST'],
    credentials: true
  }
});
