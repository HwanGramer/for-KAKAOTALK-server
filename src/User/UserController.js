const connection = require("../Config/mysql");
const { Encryption } = require("./encryption");
const passport = require('../PassPort/localStrategy');

const UserController  = {
    POSTSignUp : (req,res)=>{
        const query = `INSERT INTO user_tbl(user_id,user_pw,user_tel,user_status) VALUES('${req.body.id}','${Encryption(req.body.pw)}','${req.body.tel}','1')`;
        connection.query(query , (err , rows)=>{
            if(err){
                if(err.errno === 1062)return res.json({suc : false , msg : '이미가입된 아이디 또는 전화번호입니다'});
                return res.json({suc : false , msg : '회원가입 오류입니다'});
            }
            res.json({suc : true , msg : '가입을 축하드립니다!'});
        })
    } 
    ,
    POSTLogin : (req,res,next)=>{
        passport.authenticate('local' , (err , user , info)=>{
            if(err)return res.json({suc : false , msg : info});
            if(!user)return res.json({suc : false , msg : info});
            return req.logIn(user , (loginrr)=>{
                if(loginrr) return res.json({suc : false , msg : '로그인에러'});
                return res.json({suc : true , msg : info , userInfo : user}); //? 로그인 성공시 유저정보도 클라이언트로 넘김
            })

        })(req,res,next)
    }
    ,
    POSTChangeName : (req,res)=>{ //? 이름변경
        const query = `UPDATE user_tbl SET user_name='${req.body.newName}' WHERE user_id = '${req.user.user_id}'`
        connection.query(query , (err , rows)=>{
            if(err) return res.json({suc : false , msg : 'USER 500ERROR'});
            return res.json({suc : true , msg : '이름이 수정되었습니다'});
        })
        // console.log(req.body.newName);
        // console.log(req.user); //? req.user이용해서 바꿔야됨
    }
    ,
    POSTFindUserInfoTel : (req,res)=>{ //? 번호로 유저 찾아줌
        const query = `SELECT user_name , user_img FROM user_tbl WHERE user_tel = '${req.body.tel}'`
        connection.query(query , (err,rows)=>{
            if(err) return res.json({suc : false , msg : '데이터베이스 오류입니다'});
            if(rows.length === 0) return res.json({suc:false , msg : '존재하지않는 유저입니다'});
            return res.json({suc:true , user : rows[0]});
        })
    }
    ,

    POSTFindUserInfoId : (req,res)=>{
        const query = `SELECT user_name , user_img FROM user_tbl WHERE user_id = '${req.body.id}'`;
        connection.query(query , (err , rows)=>{
            if(err) return res.json({suc : false , msg : '데이터베이스 오류입니다'});
            if(rows.length === 0) return res.json({suc : false , msg : '존재하지않는 유저입니다'});
            return res.json({suc : true , user : rows[0]});
        })
    }
    ,

    POSTAddFriendTel : (req,res)=>{ //! 수정바람.
        // const query = `SELECT * FROM user_tbl WHERE user_tel = '${req.body.tel}'`
        // connection.query(query , (err,rows)=>{
        //     if(err) return console.log(err);
        //     console.log(rows[0]);
        // })
    }
    ,

    GETFirendList : (req,res)=>{
        const query = `SELECT * FROM friend_list WHERE user_id = '${req.user.user_id}'`
        connection.query(query , (err , rows)=>{
            if(err) return console.log(err)
            console.log(rows);
        })
    }
    ,

}


module.exports = UserController;