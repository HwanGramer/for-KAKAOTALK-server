const connection = require("../Config/mysql");

const UserController  = {
    PostSignUp : (req,res)=>{
        //! 비번 암호화 해서 집어 넣을 것!
        //! 비번 암호화 해서 집어 넣을 것!
        //! 비번 암호화 해서 집어 넣을 것!
        //! 비번 암호화 해서 집어 넣을 것!
        //! 비번 암호화 해서 집어 넣을 것!
        //! 비번 암호화 해서 집어 넣을 것!
        //! 비번 암호화 해서 집어 넣을 것!
        //! 비번 암호화 해서 집어 넣을 것!
        const query = `INSERT INTO user_tbl(user_id,user_pw,user_tel,user_status) VALUES('${req.body.id}','${req.body.pw}','${req.body.tel}','1')`;
        connection.query(query , (err , rows)=>{
            if(err){
                if(err.sqlState == '22001') return res.json({suc : false , msg : '전화번호를 알맞게 입력해주세요'});
                if(err.sqlState == '23000') return res.json({suc : false , msg : '중복되는 아이디 또는 전화번호입니다'});
            }
            console.log(rows);
        })
    }
}


module.exports = UserController;