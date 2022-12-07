const express = require('express');
const app = express();


const cookieParser = require('cookie-parser');


const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http);

const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); 
const {SESSIONKEY} = require('./src/Config/SESSIONKEY');

const UserRouter = require('./src/User/UserRouter');
const ChatRouter = require('./src/Chat/ChatRouter');

const socketController = require('./src/socketController/socketController'); //? 소켓 컨트롤러 가져옴. 

const sessionMiddleware = session({ //? 세션 설정 
    secret : SESSIONKEY , 
    resave : true , 
    saveUninitialized : false ,
    cookie : { //? 쿠키의 관한 설정들 
        httpOnly : true
    }
})

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(sessionMiddleware)
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user' , UserRouter);
app.use('/api/chat' , ChatRouter);


http.listen(8080 , ()=>{
    console.log('http server On 8080');
})




io.use((socket, next) => {
	// 외부모듈 미들웨어를 안에다 쓰일수 있다. 미들웨어 확장 원칙에 따라 res, req인자를 준다 (후술)
    cookieParser(SESSIONKEY)(socket.request, socket.request.res || {}, next);
})
.on('connection' , function(socket){

    //? 클라이언트에서 MainPage로 접속하면 그 사용자의 아이디가온다. 그 아이디에 해당하는 DB에 socket컬럼에 넣어주자.
    socket.on('DBinSocket' , function(myId , cb){ 
        socketController.DBinSocket(socket , myId , cb) 
    });

    //? 친구목록에서 더블클릭하면 개인챗이 만들어진다. 그 개인챗에서 나의 소켓정보와 나의 아이디 , 상대방의 아이디를 넣어줘야한다. 그럼 DB에 chat_room을 열을 만든다.
    //? 클라A , 클라B , DB 총3개가 접속이 끊기지않고 계속 동기화가 되어있다. !!
    socket.on('MakePrivateChat' , (userData , cb)=>{
        const req = socket.request;
        console.log(req.headers.user);
        socketController.MakePrivateChat(io , userData , socket.id , cb);
    })

    //? 클라이언트에서 챗메세지와 챗받을사람의 소켓id가 온다. -> 해당 소캣id로 챗메시지를 보낸다.
    socket.on('chatMsg' , (chatMsg , receiverSocketId ,myId,receiver,cb)=>{ 
        const req = socket.request;
        console.log(req.headers.user);
        //! 여기서 챗이 오면 저장이 DB에 저장시키는걸 해야된다
        // console.log(io.sockets.adapter.rooms.keys())
        socketController.SendChat(io,chatMsg , receiverSocketId , myId ,receiver, cb);
    })


    //? 개인챗팅방에서 나오는 last_msg를 MainPage의 채팅리스트의 last_msg와 동기화 하기위함. chatMsg->last_msg
    socket.on('UpdateLastMsg' , (sendUsersocket)=>{ //! 나에게 보낼때 socket.id로 보내면안된다. 왜냐 PrivateChatPage는 다른 소켓을 사용중이다.
        //? sendUsersocket은 상대의 MainPage소켓이다.
        io.to(sendUsersocket).emit('onLastMsg'); //? 상대방아이디와 나한테까지도 날림. 라스트메시지 업데이트임
        //? 여기서 sendUserInfo.user_socket에다가 나의 id와 마지막 메시지 날리면된다.
        //? 여기서 메시지 몇개왔는지 해도될거같긴한데...
    })

    socket.on('disconnect' , ()=>{
        console.log('접속해제' + socket.id);
    })

})
