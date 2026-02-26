require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const powerStationRoutes = require('./routes/powerStationRoutes');

// Database connection
const db = require('./config/db');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", 
  "http://192.168.1.7:5174", 
  "http://192.168.1.7:3000",
  "http://localhost:8081",
  "http://192.168.1.7:19006"  // Added for Expo
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
app.use(morgan('dev'));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KOSO Application API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: '/api/admins',
      users: '/api/users',
      power_stations: '/api/power-stations',
      health: '/health'
    }
  });
});

// API Routes
app.use('/api/admins', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/power-stations', powerStationRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected', // You can add actual DB check here
    memory: process.memoryUsage()
  });
});

// Database Check Middleware
app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({
      success: false,
      message: 'Database connection not available'
    });
  }
  next();
});

// Create default admin if doesn't exist (optional)
const createDefaultAdmin = () => {
  db.query("SELECT * FROM admin LIMIT 1", (err, results) => {
    if (err) {
      console.error('❌ Error checking admin table:', err.message);
      return;
    }
    
    if (results.length === 0) {
      const sql = "INSERT INTO admin (Name, Email, Password, created_at) VALUES (?, ?, ?, ?)";
      const defaultAdmin = ["Super Admin", "admin@koso.com", "admin123", new Date()];
      
      db.query(sql, defaultAdmin, (err, result) => {
        if (err) {
          console.error('❌ Error creating default admin:', err.message);
        } else {
          console.log("✅ Default admin created successfully!");
        }
      });
    } else {
      console.log("✅ Admin table already has records");
    }
  });
};

// Initialize default admin after a short delay
setTimeout(createDefaultAdmin, 2000);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS Error: Request blocked by CORS policy',
      allowedOrigins: allowedOrigins
    });
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/admins',
      'GET /api/users',
      'GET /api/power-stations'
    ]
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Start Server
const server = app.listen(PORT, HOST, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 KOSO APPLICATION BACKEND SERVER');
  console.log('='.repeat(60));
  
  console.log(`✅ Server running on: http://${HOST}:${PORT}`);
  console.log(`📡 API Base URL: http://${HOST}:${PORT}/api`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`📊 Node Version: ${process.version}`);
  console.log(`💾 Platform: ${process.platform}`);
  console.log('='.repeat(60) + '\n');
  
  console.log('📋 Available Endpoints:');
  console.log('   GET  /               - API Information');
  console.log('   GET  /health         - Health Check');
  console.log('   GET  /api/admins     - Admin Routes');
  console.log('   GET  /api/users      - User Routes');
  console.log('   GET  /api/power-stations - Power Station Routes');
  console.log('');
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('\n🔄 Shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    if (db && db.end) {
      db.end((err) => {
        if (err) {
          console.error('❌ Error closing database connection:', err.message);
        } else {
          console.log('✅ Database connection closed');
        }
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server, db };