const connection = require('../Config/mysql');
const ios = require('../../server');

module.exports = {

    //? 메인 페이지 접속하면 접속한 소켓이 담기게된다. 그리고 접속코드도 1로 변경해준다. 
    DBinSocket : function(socket , myId , cb){
        const query = `UPDATE user_tbl SET user_socket = '${socket.id}' , user_status = 1 WHERE user_id = '${myId}';`;
        connection.query(query , (err , rows)=>{
            if(err) console.log(err);
        })
        if(cb) cb();
    }

    ,
    //?       유저데이터와 나의 소켓아이디가 들어온다. chat_room DB 삽입      //! !!!!!!! 클라A , 클라B , 데이터베이스 이렇게 3개가 항상 동기화되있음
    MakePrivateChat : function(io , userData , mysocketId , cb){
        const myId = userData.myId; //? 채팅건사람 ID
        const mySocketId = mysocketId; //? 채팅건사람의 소켓 ID
        const receiverId = userData.receiverId //? 채팅받아야되는사람의 아이디
        const query = `SELECT * FROM chat_room WHERE member_A_id='${receiverId}' && member_B_id='${myId}'`//? 채팅받을사람이 이미 채팅방을 만들어놨다면? 나의 소켓아이디만 넣어주면된다.
        connection.query(query , (err , rows)=>{
            if(err) return console.log(err);
            if(rows.length > 0){ //? 상대방이 만들어놓은 채팅방이라면 나의 소켓아이디 업데이트
                const query = `UPDATE chat_room SET member_B_socket = '${mySocketId}' WHERE member_A_id = '${receiverId}'`
                connection.query(query , (err ,rows)=>{
                    if(err) return console.log(err);
                })
            }else{ //? 채팅방이 안만들어졌다면 , 내가 만들었었다면 나의 소켓아이디 업데이트
                const query = `INSERT INTO chat_room(member_A_id,member_A_socket,member_B_id) VALUES ('${myId}','${mySocketId}','${receiverId}')
                ON DUPLICATE KEY UPDATE member_A_socket='${mySocketId}'`;
                connection.query(query , (err , rows)=>{
                    if(err) return console.log(err);
                })
            }

            const query = `SELECT * FROM chat_room WHERE (member_A_id ='${myId}' && member_B_id='${receiverId}') || (member_A_id ='${receiverId}' && member_B_id='${myId}');`;
            connection.query(query , (err , rows)=>{ //? 이걸로 서로 소켓을 동기화 시켜준다. 서로 새로고침해도 끊기지 않도록 
                //? 이거 콜백말고 소켓으로 보냅시당.
                io.to(rows[0].member_A_socket).emit('chatSocketUpdate',rows[0]);
                io.to(rows[0].member_B_socket).emit('chatSocketUpdate',rows[0]);
            })
        })
    }
    ,
    //?  클라이언트에서 오는 챗을 받아서 DB에 저장하고 상대 클라이언트에게 소켓으로 보내준다. 
    SendChat : function(io,chatMsg , receiverSocketId ,myId,receiver, cb){
        io.to(receiverSocketId).emit('chatMsg' , {chatMsg ,myId}, (err)=>{
            const query = `INSERT INTO chat_tbl VALUES('${myId}' ,'${receiver}' ,'${chatMsg}',now());`;
            connection.query(query , (err , rows)=>{
                if(err) return cb(err);
                if(cb) cb(null);
            })
        });
    }

}