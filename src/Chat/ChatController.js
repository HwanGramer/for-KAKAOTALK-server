const connection = require('../Config/mysql');

module.exports = {

    //? 채팅내용 불러오기
    chatList : (req,res)=>{
        const {myId , receiver} = req.query; //? 쿼리 추출
        const query = `SELECT * FROM chat_tbl WHERE (myId='${myId}' || myId='${receiver}') && (receiverId = '${myId}' || receiverId = '${receiver}') ORDER BY chatTime`;
        connection.query(query , (err , rows)=>{ //? 채팅내용 불러오기
            if(err) return res.json({suc : false,  msg : '채팅데이터를 불러오지 못했습니다'});
            return res.json({suc : true , chatList : rows});
        })
    }
    ,


}