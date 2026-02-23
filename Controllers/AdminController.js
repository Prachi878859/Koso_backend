const jwt = require('jsonwebtoken');
const Admin = require("../models/adminModel");
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
// Admin Login
exports.login = (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  Admin.findByEmail(Email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = results[0];
    
    // Note: In production, use bcrypt.compare() for hashed passwords
    if (admin.Email !== Email || admin.Password !== Password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        Email: admin.Email,
        name: admin.Name,
        role: "admin" 
      }, 
      SECRET_KEY, 
      { expiresIn: "2h" }
    );

    // Remove password from response
    const { Password: adminPassword, ...adminData } = admin;
    
    res.status(200).json({ 
      message: "Login successful", 
      token,
      admin: adminData
    });
  });
};

// Get all admins
exports.getAll = (req, res) => {
  Admin.findAll((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    
    // Remove passwords from all admin records
    const admins = results.map(admin => {
      const { Password, ...adminData } = admin;
      return adminData;
    });
    
    res.status(200).json(admins);
  });
};

// Get single admin by ID
exports.getById = (req, res) => {
  const { id } = req.params;

  Admin.findById(id, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { Password, ...admin } = results[0];
    res.status(200).json(admin);
  });
};

// Create new admin
exports.create = (req, res) => {
  const { Name, Email, Password } = req.body;

  if (!Name || !Email || !Password) {
    return res.status(400).json({ message: "Name, Email and Password are required" });
  }

  // Check if admin with this email already exists
  Admin.findByEmail(Email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    // Create new admin
    Admin.create({ Name, Email, Password }, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ 
        message: "Admin created successfully", 
        id: results.insertId 
      });
    });
  });
};

// Update admin
exports.update = (req, res) => {
  const { id } = req.params;
  const { Name, Email, Password } = req.body;

  if (!Name || !Email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  // First check if admin exists
  Admin.findById(id, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if email is being changed to an existing email (excluding current admin)
    if (Email !== results[0].Email) {
      Admin.findByEmail(Email, (err, emailResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        if (emailResults.length > 0) {
          return res.status(409).json({ message: "Email already in use by another admin" });
        }

        performUpdate();
      });
    } else {
      performUpdate();
    }

    function performUpdate() {
      const updateData = { Name, Email };
      
      // Only update password if provided
      if (Password) {
        updateData.Password = Password;
      }

      Admin.update(id, updateData, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        res.status(200).json({ message: "Admin updated successfully" });
      });
    }
  });
};

// Delete admin
exports.delete = (req, res) => {
  const { id } = req.params;

  // First check if admin exists
  Admin.findById(id, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    Admin.delete(id, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ message: "Admin deleted successfully" });
    });
  });
};

// Update admin password only
exports.updatePassword = (req, res) => {
  const { id } = req.params;
  const { newPassword, currentPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  // First get current admin to verify current password
  Admin.findById(id, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = results[0];

    // Verify current password
    if (currentPassword && admin.Password !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    Admin.updatePassword(id, newPassword, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ message: "Password updated successfully" });
    });
  });
};

// Get profile (current admin - similar to your SuperAdmin show)
exports.profile = (req, res) => {
  // If you want to get the admin from token instead of first admin
  // const adminId = req.user.id; // Assuming you set this in authentication middleware
  
  Admin.find((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "No admin found" });
    }
    
    const { Password, ...admin } = results[0];
    res.status(200).json(admin);
  });
};