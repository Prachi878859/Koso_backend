const db = require("../config/db");
const bcrypt = require("bcryptjs"); // Still keep bcrypt for backward compatibility

const Users = {
  // Find all users (including status)
  findAll: (callback) => {
    const sql = "SELECT id, Name, Email, status, created_at, updated_at FROM users ORDER BY created_at DESC";
    db.query(sql, callback);
  },

  // Find user by ID (including status)
  findById: (id, callback) => {
    const sql = "SELECT id, Name, Email, status, created_at, updated_at FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Find user by email (with password for auth)
  findByEmail: (email, callback) => {
    const sql = "SELECT id, Name, Email, Password, status, created_at, updated_at FROM users WHERE Email = ?";
    db.query(sql, [email], callback);
  },

  // Create new user with PLAIN TEXT password (NOT RECOMMENDED)
  create: (data, callback) => {
    const sql = "INSERT INTO users (Name, Email, Password, status) VALUES (?, ?, ?, ?)";
    // Default status is 'Active' when creating a new user
    db.query(sql, [data.Name, data.Email, data.Password, data.status || 'Active'], callback);
  },

  // Update user profile (name, email and status)
  update: (id, data, callback) => {
    const sql = "UPDATE users SET Name=?, Email=?, status=? WHERE id=?";
    db.query(sql, [data.Name, data.Email, data.status || 'Active', id], callback);
  },

  // Update user status only
  updateStatus: (id, status, callback) => {
    const sql = "UPDATE users SET status=? WHERE id=?";
    db.query(sql, [status, id], callback);
  },

  // Update user profile with optional password
  updateWithPassword: (id, data, callback) => {
    if (data.Password) {
      // Update name, email, password, and status
      const sql = "UPDATE users SET Name=?, Email=?, Password=?, status=? WHERE id=?";
      db.query(sql, [data.Name, data.Email, data.Password, data.status || 'Active', id], callback);
    } else {
      // Update only name, email, and status
      const sql = "UPDATE users SET Name=?, Email=?, status=? WHERE id=?";
      db.query(sql, [data.Name, data.Email, data.status || 'Active', id], callback);
    }
  },

  // Update password with PLAIN TEXT (NOT RECOMMENDED)
  updatePassword: (id, newPassword, callback) => {
    const sql = "UPDATE users SET Password=? WHERE id=?";
    db.query(sql, [newPassword, id], callback);
  },

  // Verify password (simple string comparison)
  verifyPassword: (plainPassword, storedPassword) => {
    return plainPassword === storedPassword;
  },

  // Delete user by ID
  delete: (id, callback) => {
    const sql = "DELETE FROM users WHERE id=?";
    db.query(sql, [id], callback);
  },

  // Find single user
  find: (callback) => {
    const sql = "SELECT id, Name, Email, status, created_at FROM users LIMIT 1";
    db.query(sql, callback);
  },

  // Check if user exists by email
  existsByEmail: (email, callback) => {
    const sql = "SELECT id FROM users WHERE Email = ?";
    db.query(sql, [email], callback);
  },

  emailExists: (email, callback) => {
    const sql = "SELECT COUNT(*) as count FROM users WHERE Email = ?";
    db.query(sql, [email], callback);
  },

  // Paginate users
  paginate: (limit, offset, callback) => {
    const sql = "SELECT id, Name, Email, status, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?";
    db.query(sql, [limit, offset], callback);
  },

  // Get user statistics
  getStats: (callback) => {
    const sql = `
      SELECT 
        COUNT(*) as totalUsers,
        status,
        COUNT(*) as statusCount
      FROM users 
      GROUP BY status
    `;
    db.query(sql, callback);
  },

  // Search users
  search: (query, callback) => {
    const sql = "SELECT id, Name, Email, status, created_at FROM users WHERE Name LIKE ? OR Email LIKE ?";
    const searchTerm = `%${query}%`;
    db.query(sql, [searchTerm, searchTerm], callback);
  },

  // Check if user is active (for login validation)
  isUserActive: (email, callback) => {
    const sql = "SELECT status FROM users WHERE Email = ?";
    db.query(sql, [email], callback);
  }
};
 
 findByIdWithPassword: (id, callback) => {
  const sql = "SELECT id, Name, Email, Password, status FROM users WHERE id = ?";
  db.query(sql, [id], callback);
},
module.exports = Users;