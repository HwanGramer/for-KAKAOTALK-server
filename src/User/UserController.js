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
    POSTChangeName : (req,res)=>{
        const query = `UPDATE user_tbl SET user_name='${req.body.newName}' WHERE user_id = '${req.user.user_id}'`
        connection.query(query , (err , rows)=>{
            if(err) return res.json({suc : false , msg : 'USER 500ERROR'});
            return res.json({suc : true , msg : '이름이 수정되었습니다'});
        })
        // console.log(req.body.newName);
        // console.log(req.user); //? req.user이용해서 바꿔야됨
    }
}


module.exports = UserController;