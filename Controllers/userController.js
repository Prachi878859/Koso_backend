const User = require("../models/Usermodel");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { sendCredentialsEmail ,sendPasswordResetEmail,sendUpdateEmail,resendCredentialsEmail} = require("../config/emailService");

// Generate random password
const generateRandomPassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const userController = {
  
  // Create User with PLAIN TEXT password
  createUser: async (req, res) => {
    try {
      const { Name, Email, Password } = req.body;
      
      console.log("🔄 Creating user for:", Email);
      console.log("⚠️ WARNING: Storing password in plain text!");
      
      // Validate input
      if (!Name || !Email || !Password) {
        return res.status(400).json({
          success: false,
          message: "Name, Email and Password are required"
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address"
        });
      }

      // Validate password strength
      if (Password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long"
        });
      }

      // Check if email already exists
      User.emailExists(Email, (emailError, emailResults) => {
        if (emailError) {
          console.error("Database error:", emailError);
          return res.status(500).json({
            success: false,
            message: "Database error while checking email",
            error: emailError.message
          });
        }

        if (emailResults[0].count > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already exists"
          });
        }

        console.log(`🔑 Storing plain text password: ${Password}`);
        
        // Create user data with PLAIN TEXT password
        const userData = {
          Name: Name.trim(),
          Email: Email.trim().toLowerCase(),
          Password: Password // Storing plain text (NOT RECOMMENDED)
        };

        // Save user to database
        User.create(userData, async (createError, results) => {
          if (createError) {
            console.error("User creation error:", createError);
            return res.status(500).json({
              success: false,
              message: "Error creating user",
              error: createError.message
            });
          }

          console.log(`✅ User created successfully with ID: ${results.insertId}`);

          try {
            // Send email with credentials
            console.log(`📧 Attempting to send email to: ${Email}`);
            const emailSent = await sendCredentialsEmail(Email, Name, Password);
            
            if (emailSent) {
              console.log(`✅ Credentials email sent to ${Email}`);
              return res.status(201).json({
                success: true,
                message: "User created successfully. Credentials sent to email.",
                data: {
                  id: results.insertId,
                  Name: userData.Name,
                  Email: userData.Email,
                  created_at: new Date(),
                  warning: "Password is stored in plain text - SECURITY RISK!"
                }
              });
            } else {
              // Email failed but user was created
              console.log(`⚠️ Email failed but user created for ${Email}`);
              return res.status(201).json({
                success: true,
                message: "User created successfully but email failed to send.",
                data: {
                  id: results.insertId,
                  Name: userData.Name,
                  Email: userData.Email,
                  created_at: new Date(),
                  warning: "Email sending failed. Password stored in plain text."
                }
              });
            }
          } catch (emailError) {
            console.error("Email sending error:", emailError);
            // User was created but email failed
            return res.status(201).json({
              success: true,
              message: "User created but email notification failed.",
              data: {
                id: results.insertId,
                Name: userData.Name,
                Email: userData.Email,
                created_at: new Date(),
                warning: "Email notification failed. Password stored in plain text."
              }
            });
          }
        });
      });
    } catch (error) {
      console.error("Server error in createUser:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  },

  // // Login User with PLAIN TEXT password comparison
  // loginUser: async (req, res) => {
  //   try {
  //     const { Email, Password } = req.body;
      
  //     if (!Email || !Password) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Email and Password are required"
  //       });
  //     }

  //     // Find user by email
  //     User.findByEmail(Email, (error, results) => {
  //       if (error) {
  //         console.error("Database error in findByEmail:", error);
  //         return res.status(500).json({
  //           success: false,
  //           message: "Database error",
  //           error: error.message
  //         });
  //       }

  //       if (results.length === 0) {
  //         console.log(`No user found with email: ${Email}`);
  //         return res.status(401).json({
  //           success: false,
  //           message: "Invalid credentials"
  //         });
  //       }

  //       const user = results[0];
        
  //       console.log("User found:", {
  //         id: user.id,
  //         email: user.Email,
  //         storedPassword: user.Password ? "***" : "undefined"
  //       });
        
  //       // Check if password field exists
  //       if (!user.Password) {
  //         console.error("Password field is undefined for user:", user.id);
  //         return res.status(500).json({
  //           success: false,
  //           message: "Server configuration error"
  //         });
  //       }

  //       // SIMPLE PLAIN TEXT COMPARISON (NOT RECOMMENDED)
  //       if (Password !== user.Password) {
  //         console.log("Password mismatch for user:", user.id);
  //         console.log(`Input: "${Password}" vs Stored: "${user.Password}"`);
  //         return res.status(401).json({
  //           success: false,
  //           message: "Invalid credentials"
  //         });
  //       }

  //       // Generate JWT token
  //       const token = jwt.sign(
  //         {
  //           id: user.id,
  //           Name: user.Name,
  //           Email: user.Email
  //         },
  //         process.env.JWT_SECRET || "your-secret-key",
  //         { expiresIn: "7d" }
  //       );

  //       // Remove password from response
  //       const { Password: _, ...userWithoutPassword } = user;

  //       return res.status(200).json({
  //         success: true,
  //         message: "Login successful",
  //         data: {
  //           user: userWithoutPassword,
  //           token
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.error("Unexpected error in loginUser:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Server error",
  //       error: error.message
  //     });
  //   }
  // },

  loginUser: async (req, res) => {
  try {
    const { Email, Password } = req.body;
    
    if (!Email || !Password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });
    }

    // Find user by email
    User.findByEmail(Email, (error, results) => {
      if (error) {
        console.error("Database error in findByEmail:", error);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: error.message
        });
      }

      if (results.length === 0) {
        console.log(`No user found with email: ${Email}`);
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      const user = results[0];
      
      // Check if user is active
      if (user.status !== 'Active') {
        console.log(`User ${Email} is ${user.status}. Login denied.`);
        return res.status(403).json({
          success: false,
          message: `Your account is ${user.status.toLowerCase()}. Please contact administrator.`
        });
      }
      
      console.log("User found:", {
        id: user.id,
        email: user.Email,
        status: user.status,
        storedPassword: user.Password ? "***" : "undefined"
      });
      
      // Check if password field exists
      if (!user.Password) {
        console.error("Password field is undefined for user:", user.id);
        return res.status(500).json({
          success: false,
          message: "Server configuration error"
        });
      }

      // SIMPLE PLAIN TEXT COMPARISON (NOT RECOMMENDED)
      if (Password !== user.Password) {
        console.log("Password mismatch for user:", user.id);
        console.log(`Input: "${Password}" vs Stored: "${user.Password}"`);
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          Name: user.Name,
          Email: user.Email,
          status: user.status
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      // Remove password from response
      const { Password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token
        }
      });
    });
  } catch (error) {
    console.error("Unexpected error in loginUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
},

  // Get All Users
  getAllUsers: (req, res) => {
    User.findAll((error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching users",
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: results,
        count: results.length
      });
    });
  },

  // Get Single User by ID
  getUserById: (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    User.findById(id, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching user",
          error: error.message
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: results[0]
      });
    });
  },

  // // Update User
  // updateUser: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { Name, Email } = req.body;
      
  //     if (!id) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "User ID is required"
  //       });
  //     }

  //     if (!Name || !Email) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Name and Email are required"
  //       });
  //     }

  //     // Check if user exists
  //     User.findById(id, (checkError, checkResults) => {
  //       if (checkError) {
  //         return res.status(500).json({
  //           success: false,
  //           message: "Error checking user",
  //           error: checkError.message
  //         });
  //       }

  //       if (checkResults.length === 0) {
  //         return res.status(404).json({
  //           success: false,
  //           message: "User not found"
  //         });
  //       }

  //       // Check if email is being changed and if new email already exists
  //       if (Email !== checkResults[0].Email) {
  //         User.emailExists(Email, (emailError, emailResults) => {
  //           if (emailError) {
  //             return res.status(500).json({
  //               success: false,
  //               message: "Database error",
  //               error: emailError.message
  //             });
  //           }

  //           if (emailResults[0].count > 0) {
  //             return res.status(400).json({
  //               success: false,
  //               message: "Email already exists"
  //             });
  //           }

  //           // Update user
  //           updateUserProfile(id, Name, Email, res);
  //         });
  //       } else {
  //         // Email not changed, just update
  //         updateUserProfile(id, Name, Email, res);
  //       }
  //     });

  //     function updateUserProfile(userId, userName, userEmail, response) {
  //       const updateData = {
  //         Name: userName,
  //         Email: userEmail
  //       };

  //       User.update(userId, updateData, (updateError, updateResults) => {
  //         if (updateError) {
  //           return response.status(500).json({
  //             success: false,
  //             message: "Error updating user",
  //             error: updateError.message
  //           });
  //         }

  //         return response.status(200).json({
  //           success: true,
  //           message: "User updated successfully",
  //           data: {
  //             id: userId,
  //             Name: userName,
  //             Email: userEmail
  //           }
  //         });
  //       });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Server error",
  //       error: error.message
  //     });
  //   }
  // },

  // Update User with optional password update and email notification
updateUser: async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Email, Password } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    if (!Name || !Email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Validate password if provided
    if (Password && Password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user exists
    User.findById(id, (checkError, checkResults) => {
      if (checkError) {
        console.error("Database error checking user:", checkError);
        return res.status(500).json({
          success: false,
          message: "Error checking user",
          error: checkError.message
        });
      }

      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const currentUser = checkResults[0];
      const changes = [];
      const sendCredentials = Password ? true : false;
      let newPassword = Password;

      // Track what's changing
      if (Name !== currentUser.Name) {
        changes.push(`Name: ${currentUser.Name} → ${Name}`);
      }
      if (Email !== currentUser.Email) {
        changes.push(`Email: ${currentUser.Email} → ${Email}`);
      }
      if (Password) {
        changes.push("Password: Updated");
      }

      console.log(`🔄 Updating user ID: ${id}`);
      console.log(`📝 Changes detected: ${changes.length > 0 ? changes.join(', ') : 'None'}`);
      
      // Check if email is being changed and if new email already exists
      if (Email !== currentUser.Email) {
        User.emailExists(Email, (emailError, emailResults) => {
          if (emailError) {
            console.error("Database error checking email:", emailError);
            return res.status(500).json({
              success: false,
              message: "Database error",
              error: emailError.message
            });
          }

          if (emailResults[0].count > 0) {
            return res.status(400).json({
              success: false,
              message: "Email already exists"
            });
          }

          // Update user
          updateUserProfile(id, Name, Email, Password, currentUser, changes, sendCredentials, res);
        });
      } else {
        // Email not changed, just update
        updateUserProfile(id, Name, Email, Password, currentUser, changes, sendCredentials, res);
      }
    });

    async function updateUserProfile(userId, userName, userEmail, userPassword, currentUser, changes, sendCredentials, response) {
      try {
        // If password is provided, update it
        if (userPassword) {
          console.log(`🔑 Updating password for user ID: ${userId}`);
          
          User.updatePassword(userId, userPassword, async (passwordError, passwordResults) => {
            if (passwordError) {
              console.error("Error updating password:", passwordError);
              return response.status(500).json({
                success: false,
                message: "Error updating password",
                error: passwordError.message
              });
            }

            console.log("✅ Password updated successfully");
            
            // Now update name and email
            updateNameAndEmail(userId, userName, userEmail, userPassword, currentUser, changes, sendCredentials, response);
          });
        } else {
          // No password update, just update name and email
          updateNameAndEmail(userId, userName, userEmail, null, currentUser, changes, sendCredentials, response);
        }
      } catch (error) {
        console.error("Error in updateUserProfile:", error);
        return response.status(500).json({
          success: false,
          message: "Server error",
          error: error.message
        });
      }
    }

    async function updateNameAndEmail(userId, userName, userEmail, userPassword, currentUser, changes, sendCredentials, response) {
      const updateData = {
        Name: userName.trim(),
        Email: userEmail.trim().toLowerCase()
      };

      User.update(userId, updateData, async (updateError, updateResults) => {
        if (updateError) {
          console.error("Error updating user profile:", updateError);
          return response.status(500).json({
            success: false,
            message: "Error updating user",
            error: updateError.message
          });
        }

        console.log(`✅ User profile updated successfully for ID: ${userId}`);
        
        // Prepare response data
        const responseData = {
          id: userId,
          Name: userName,
          Email: userEmail,
          updated_at: new Date(),
          changes: changes.length > 0 ? changes : ["No changes detected"],
          warning: userPassword ? "Password stored in plain text - SECURITY RISK!" : undefined
        };

        // Send email if password was updated or email changed
        if (sendCredentials || userEmail !== currentUser.Email) {
          try {
            const emailSubject = userPassword 
              ? "Your Account Credentials Have Been Updated" 
              : "Your Account Information Has Been Updated";
            
            const emailMessage = userPassword
              ? `Dear ${userName},<br><br>
                 Your account credentials have been updated successfully.<br><br>
                 <strong>New Login Details:</strong><br>
                 <strong>Email:</strong> ${userEmail}<br>
                 <strong>Password:</strong> ${userPassword}<br><br>
                 Please login with your new credentials and change your password after first login for security.<br><br>
                 <em>Note: For security reasons, we recommend changing your password regularly.</em>`
              : `Dear ${currentUser.Name},<br><br>
                 Your account information has been updated successfully.<br><br>
                 <strong>Updated Details:</strong><br>
                 <strong>Name:</strong> ${userName}<br>
                 <strong>Email:</strong> ${userEmail}<br><br>
                 If you did not request these changes, please contact our support team immediately.`;
            
            console.log(`📧 Attempting to send update notification to: ${userEmail}`);
            
            // You need to implement sendUpdateEmail function in your email service
            const emailSent = await sendUpdateEmail(
              userEmail, 
              userName, 
              emailSubject, 
              emailMessage,
              userPassword
            );
            
            if (emailSent) {
              console.log(`✅ Update notification email sent to ${userEmail}`);
              responseData.emailNotification = "Update notification email sent successfully";
              responseData.emailSentTo = userEmail;
            } else {
              console.log(`⚠️ Email failed to send for ${userEmail}`);
              responseData.emailNotification = "Update notification email failed to send";
            }
          } catch (emailError) {
            console.error("Email sending error:", emailError);
            responseData.emailNotification = "Update notification email failed";
          }
        }

        return response.status(200).json({
          success: true,
          message: userPassword 
            ? "User updated successfully. New credentials have been set and notification sent." 
            : "User updated successfully.",
          data: responseData
        });
      });
    }
  } catch (error) {
    console.error("Server error in updateUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
},

  // Update User Password with PLAIN TEXT
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      
      if (!id || !currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters"
        });
      }

      // Get user to verify current password
      User.findByEmail(req.user?.Email || '', (error, results) => {
        if (error || results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }

        const user = results[0];
        
        // Verify current password (plain text comparison)
        if (currentPassword !== user.Password) {
          return res.status(401).json({
            success: false,
            message: "Current password is incorrect"
          });
        }

        // Update with plain text password
        User.updatePassword(id, newPassword, (updateError, updateResults) => {
          if (updateError) {
            return res.status(500).json({
              success: false,
              message: "Error updating password",
              error: updateError.message
            });
          }

          return res.status(200).json({
            success: true,
            message: "Password updated successfully",
            warning: "Password stored in plain text - SECURITY RISK!"
          });
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  },

updateUserStatus: async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "User ID and status are required"
      });
    }

    // Validate status
    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Active' or 'Inactive'"
      });
    }

    // Check if user exists
    User.findById(id, (checkError, checkResults) => {
      if (checkError) {
        console.error("Database error checking user:", checkError);
        return res.status(500).json({
          success: false,
          message: "Error checking user",
          error: checkError.message
        });
      }

      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const user = checkResults[0];
      
      // Update user status
      const sql = "UPDATE users SET status = ? WHERE id = ?";
      db.query(sql, [status, id], (updateError, updateResults) => {
        if (updateError) {
          console.error("Error updating user status:", updateError);
          return res.status(500).json({
            success: false,
            message: "Error updating user status",
            error: updateError.message
          });
        }

        console.log(`✅ User ${id} status updated to: ${status}`);
        
        return res.status(200).json({
          success: true,
          message: `User ${status.toLowerCase()} successfully`,
          data: {
            id: id,
            name: user.Name,
            email: user.Email,
            previousStatus: user.status,
            newStatus: status,
            updated_at: new Date()
          }
        });
      });
    });
  } catch (error) {
    console.error("Server error in updateUserStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
},

  // Delete User
  deleteUser: (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Check if user exists first
    User.findById(id, (checkError, checkResults) => {
      if (checkError) {
        return res.status(500).json({
          success: false,
          message: "Error checking user",
          error: checkError.message
        });
      }

      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Delete user
      User.delete(id, (deleteError, deleteResults) => {
        if (deleteError) {
          return res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: deleteError.message
          });
        }

        return res.status(200).json({
          success: true,
          message: "User deleted successfully"
        });
      });
    });
  },

  // Get Current User Profile
  getProfile: (req, res) => {
    const userId = req.user?.id || req.params.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    User.findById(userId, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching profile",
          error: error.message
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: results[0]
      });
    });
  },

  // Search Users
  searchUsers: (req, res) => {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    User.search(query.trim(), (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error searching users",
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Search results",
        data: results,
        count: results.length
      });
    });
  },

  // Additional method: Reset password to random (for admin use)
  resetPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      if (!id || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "User ID and new password are required"
        });
      }

      // Check if user exists
      User.findById(id, (checkError, checkResults) => {
        if (checkError || checkResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }

        const user = checkResults[0];
        
        // Update with plain text password
        User.updatePassword(id, newPassword, (updateError, updateResults) => {
          if (updateError) {
            return res.status(500).json({
              success: false,
              message: "Error resetting password",
              error: updateError.message
            });
          }

          // Optionally send email with new password
          return res.status(200).json({
            success: true,
            message: "Password reset successfully",
            data: {
              id: user.id,
              email: user.Email,
              warning: "Password stored in plain text - Please inform the user securely!"
            }
          });
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  },

  resendCredentials: async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔄 Resend credentials requested for user ID: ${id}`);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // First, find user by ID to get their email
    User.findById(id, async (error, results) => {
      if (error) {
        console.error("Database error fetching user:", error);
        return res.status(500).json({
          success: false,
          message: "Error fetching user",
          error: error.message
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const user = results[0];
      console.log(`📧 Found user: ${user.Email}`);
      
      // Now use findByEmail to get the user with password
      User.findByEmail(user.Email, async (emailError, emailResults) => {
        if (emailError) {
          console.error("Database error fetching user with password:", emailError);
          return res.status(500).json({
            success: false,
            message: "Error fetching user credentials",
            error: emailError.message
          });
        }

        if (emailResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User credentials not found"
          });
        }

        const userWithPassword = emailResults[0];
        
        console.log(`🔑 User password exists: ${!!userWithPassword.Password}`);
        console.log(`👤 User status: ${userWithPassword.status}`);
        
        // Check if user is active
        if (userWithPassword.status !== 'Active') {
          return res.status(400).json({
            success: false,
            message: `Cannot send credentials. User account is ${userWithPassword.status}.`
          });
        }
        
        // Check if user has a password
        if (!userWithPassword.Password || userWithPassword.Password.trim() === '') {
          console.error("User has no password stored:", user.id);
          return res.status(400).json({
            success: false,
            message: "User has no password set. Please reset password first."
          });
        }

        try {
          console.log(`📧 Attempting to resend credentials to: ${user.Email}`);
          
          // Import the resend function
          const { resendCredentialsEmail } = require("../config/emailService");
          
          const emailSent = await resendCredentialsEmail(
            user.Email, 
            user.Name, 
            userWithPassword.Password
          );
          
          if (emailSent) {
            console.log(`✅ Credentials email resent to ${user.Email}`);
            
            // Log this action
            console.log("📝 Action logged: RESEND_CREDENTIALS", {
              userId: user.id,
              email: user.Email,
              timestamp: new Date(),
              performedBy: req.user?.id || 'system'
            });
            
            return res.status(200).json({
              success: true,
              message: "Credentials resent successfully",
              data: {
                userId: user.id,
                name: user.Name,
                email: user.Email,
                status: user.status,
                sentAt: new Date(),
                warning: "Password stored in plain text - For security, user should change password immediately!"
              }
            });
          } else {
            console.log(`❌ Failed to resend credentials to ${user.Email}`);
            return res.status(500).json({
              success: false,
              message: "Failed to resend credentials email. Please check email configuration.",
              data: {
                userId: user.id,
                email: user.Email
              }
            });
          }
        } catch (emailError) {
          console.error("Email sending error:", emailError);
          return res.status(500).json({
            success: false,
            message: "Error sending credentials email",
            error: emailError.message
          });
        }
      });
    });
  } catch (error) {
    console.error("Server error in resendCredentials:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
},
};

module.exports = userController;