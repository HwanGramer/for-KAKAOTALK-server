//? /api/user
const express = require('express');
const UserController = require('./UserController');
const UserRouter = express.Router();

UserRouter.post('/signUp' , UserController.PostSignUp);

module.exports = UserRouter;