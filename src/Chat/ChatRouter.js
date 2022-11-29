const express = require('express');
const ChatRouter = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../PassPort/loginMiddleware');
const ChatController = require('./ChatController');

// ? /api/chat/

ChatRouter.post('/chatSocketInfo' , isLoggedIn ,(req,res)=>{
    //? 저장된 채팅방의 상대소켓아이디 가져오기.
})

//? 채팅목록 불러오기
ChatRouter.get('/chatList' , isLoggedIn , ChatController.chatList);

module.exports = ChatRouter;