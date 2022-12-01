const express = require('express');
const ChatRouter = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../PassPort/loginMiddleware');
const ChatController = require('./ChatController');

// ? /api/chat/

//? 채팅목록 불러오기
ChatRouter.get('/chatList' , isLoggedIn , ChatController.chatList);

//? 채팅방 목록 불러오기
ChatRouter.get('/roomList' , isLoggedIn , ChatController.roomList);

//? 채팅방에 들어가면 모든 채팅 읽기
ChatRouter.put('/sawChat' , isLoggedIn , ChatController.sawChat);

module.exports = ChatRouter;