const express = require('express');
const ChatRouter = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../PassPort/loginMiddleware');

ChatRouter.post('/chatSocketInfo' , isLoggedIn ,(req,res)=>{
    //? 저장된 채팅방의 상대소켓아이디 가져오기.
})

module.exports = ChatRouter;