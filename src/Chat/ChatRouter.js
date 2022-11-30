const express = require('express');
const ChatRouter = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../PassPort/loginMiddleware');
const ChatController = require('./ChatController');

// ? /api/chat/

//? 채팅목록 불러오기
ChatRouter.get('/chatList' , isLoggedIn , ChatController.chatList);


ChatRouter.get('/roomList' , isLoggedIn , ChatController.roomList);

module.exports = ChatRouter;