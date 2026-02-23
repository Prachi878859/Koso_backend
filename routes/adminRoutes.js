const express = require("express");
const router = express.Router();
const AdminController = require("../Controllers/AdminController");
const Admin = require("../models/adminModel");

//Login Admin
router.post("/login",AdminController.login);

//Get all admin
router.get('/', AdminController.getAll);

//Get Admin by id 
router.get('/:id', AdminController.getById);

//Create Admin
router.post('/', AdminController.create);

//Update Admin
router.put('/:id', AdminController.update);

//Delete Admin
router.delete('/:id', AdminController.delete);

//Get Profile
router.get('/profile', AdminController.profile);

//Update Password
router.patch('/:id/password', AdminController.updatePassword);

module.exports = router;