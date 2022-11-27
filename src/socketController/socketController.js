const connection = require('../Config/mysql');


module.exports = {

    //? 메인 페이지 접속하면 접속한 소켓이 담기게된다. 그리고 접속코드도 1로 변경해준다. 
    DBinSocket : function(socket , myId , cb){
        const query = `UPDATE user_tbl SET user_socket = '${socket.id}' , user_status = 1 WHERE user_id = '${myId}';`;
        connection.query(query , (err , rows)=>{
            if(err) console.log(err);
        })
    }

}