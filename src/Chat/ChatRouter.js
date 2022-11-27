const express = require('express');
const ChatRouter = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../PassPort/loginMiddleware');


ChatRouter.post('/makePrivateChat' , (req,res)=>{
    //? 일단 여기서 makePrivateChat 이 테이블에 저장해야됨. 
    //? 지금 막힌게 뭐냐면 라우터나 컨트롤러에서 req.socket으로 socket.id를 어케 알지..
    // console.log(req.user);
    // console.log(req.socket);
    // console.log(req.socket);
    console.log(req.socket.info);
})

module.exports = ChatRouter;