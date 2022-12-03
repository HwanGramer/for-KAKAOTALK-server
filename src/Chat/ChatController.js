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

    roomList : (req,res)=>{
        const {user_id,user_name} = req.user;
        //?  여기서 뽑아와야ㅗ딤
        const query = `SELECT C.member_A_id , C.member_B_id ,C.last_msg , C.sender , C.chatTime , C.saw_chat , U.user_img , U.user_name , U.user_id
        FROM chat_room C
        INNER JOIN user_tbl U
        ON C.member_A_id = U.user_id OR C.member_B_id = U.user_id
        WHERE (C.member_A_id='${user_id}' OR C.member_B_id='${user_id}') AND U.user_name != '${user_name}'
        ORDER BY chatTime DESC;`; //? 여기서 나오는 데이터에서 나의 user_name과 같은 컬럼은 빼줘야한다.
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        connection.query(query , (err , rows)=>{
            if(err) return res.json({suc : false , msg : '채팅목록을 불러오지 못했습니다'});
            return res.json({suc : true , roomList : rows});
        })
    }
    ,
    sawChat : (req,res)=>{
        //* 메세지를 받는사람의 아이디와 채팅방에있는 메세지를 읽을려고 하는사람의 아이디와 같다면 saw_chat은 0이 되어야함 왜 냐 봤기때문에
        const {receiver , myId} = req.body //? 받는사람아이디
        if(receiver !== req.user.user_id){
            const query = `UPDATE chat_room SET saw_chat='0' WHERE (member_A_id='${receiver}' AND member_B_id='${myId}' AND sender='${receiver}') OR (member_A_id='${myId}' AND member_B_id='${receiver}' AND sender='${receiver}');`;
            connection.query(query , (err,rows)=>{
                if(err) return res.json({suc : false , msg :'saw_chat err'});
                return res.json({suc : true});
            })
        }
    }
}