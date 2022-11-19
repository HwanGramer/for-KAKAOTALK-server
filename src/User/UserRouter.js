//? /api/user
const express = require('express');
const UserController = require('./UserController');
const UserRouter = express.Router();

UserRouter.post('/signUp' , UserController.POSTSignUp); //? 회원가입처리

UserRouter.post('/login' , UserController.POSTLogin); //? 로그인처리

module.exports = UserRouter;