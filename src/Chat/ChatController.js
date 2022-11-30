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
        const {user_id} = req.user;
        //?  여기서 뽑아와야ㅗ딤
        const query = `SELECT member_A_id , member_B_id ,last_msg , sender , chatTime FROM chat_room WHERE member_A_id='${user_id}' OR member_B_id='${user_id}' ORDER BY chatTime DESC;`;
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        // ! 이거 사용자 정보랑 같이 JOIN해서 가져와야 한다 . 그 사용자의 정보는 req.user_id와 다른사람의 id를 join해야한다
        connection.query(query , (err , rows)=>{
            if(err) return res.json({suc : false , msg : '채팅목록을 불러오지 못했습니다'});
            return res.json({suc : true , roomList : rows});
        })
    }

}