const db = require("../config/db");

const Admin = {
  // Find all admins
  findAll: (callback) => {
    const sql = "SELECT id, Name, Email, created_at, updated_at FROM admin";
    db.query(sql, callback);
  },

  // Find admin by ID
  findById: (id, callback) => {
    const sql = "SELECT id, Name, Email, created_at, updated_at FROM admin WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Find admin by email
  findByEmail: (email, callback) => {
    const sql = "SELECT id, Name, Email, Password, created_at, updated_at FROM admin WHERE Email = ?";
    db.query(sql, [email], callback);
  },

  // Create new admin
  create: (data, callback) => {
    const sql = "INSERT INTO admin (Name, Email, Password) VALUES (?, ?, ?)";
    db.query(sql, [data.Name, data.Email, data.Password], callback);
  },

  // Update admin by ID
  update: (id, data, callback) => {
    const sql = "UPDATE admin SET Name=?, Email=?, Password=? WHERE id=?";
    db.query(sql, [data.Name, data.Email, data.Password, id], callback);
  },

  // Delete admin by ID
  delete: (id, callback) => {
    const sql = "DELETE FROM admin WHERE id=?";
    db.query(sql, [id], callback);
  },

  // Update admin password
  updatePassword: (id, newPassword, callback) => {
    const sql = "UPDATE admin SET Password=? WHERE id=?";
    db.query(sql, [newPassword, id], callback);
  },

  // Find single admin (similar to your SuperAdmin find method)
  find: (callback) => {
    const sql = "SELECT id, Name, Email, created_at FROM admin LIMIT 1";
    db.query(sql, callback);
  }
};

module.exports = Admin;