import app from './app';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
// import { logger } from './utils/logger'; // Will be created later
// import { initSocket } from './sockets'; // Will be created later
// import { PrismaClient } from '@prisma/client'; // Will be imported when used

// const prisma = new PrismaClient(); // Initialize Prisma Client

const PORT = process.env.BACKEND_PORT || 3001;

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// initSocket(io); // Initialize socket handlers

httpServer.listen(PORT, async () => {
  // try {
    // await prisma.$connect(); // Connect to database
    // logger.info('Connected to the database successfully.');
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`Socket.IO server is listening on port ${PORT}`);
  // } catch (error) {
    // logger.error('Failed to connect to the database:', error);
    // process.exit(1); // Exit if DB connection fails
  // }
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  console.log(`
${signal} signal received. Shutting down gracefully...`);
  httpServer.close(async () => {
    console.log('HTTP server closed.');
    // await prisma.$disconnect();
    // logger.info('Database connection closed.');
    // Add any other cleanup tasks here
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT')); // Catches Ctrl+C
