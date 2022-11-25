const connection = require("../Config/mysql");
const { Encryption } = require("./encryption");
const passport = require('../PassPort/localStrategy');
const profileImgUpload = require('../Multer/Multer');

const UserController  = {
    POSTSignUp : (req,res)=>{ //? 이름 기본값으로 들어가는건 아이디임
        const query = `INSERT INTO user_tbl(user_name,user_id,user_pw,user_tel,user_status) VALUES('${req.body.id}','${req.body.id}','${Encryption(req.body.pw)}','${req.body.tel}','1')`;
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
    POSTFindUserInfoTel : (req,res)=>{ //? 번호로 유저 찾아줌
        const query = `SELECT user_id , user_name , user_img FROM user_tbl WHERE user_tel = '${req.body.tel}'`
        connection.query(query , (err,rows)=>{
            if(err) return res.json({suc : false , msg : '데이터베이스 오류입니다'});
            if(rows.length === 0) return res.json({suc:false , msg : '존재하지않는 유저입니다'});
            return res.json({suc:true , user : rows[0]});
        })
    }
    ,

    POSTFindUserInfoId : (req,res)=>{ //? 아이디로 유저 찾아줌 
        const query = `SELECT user_id , user_name , user_img FROM user_tbl WHERE user_id = '${req.body.id}'`;
        connection.query(query , (err , rows)=>{
            if(err) return res.json({suc : false , msg : '데이터베이스 오류입니다'});
            if(rows.length === 0) return res.json({suc : false , msg : '존재하지않는 유저입니다'});
            return res.json({suc : true , user : rows[0]});
        })
    }
    ,

    POSTAddFriend : (req,res)=>{ //! 수정바람.
        const query = `INSERT INTO friend_list VALUES('${req.user.user_id}' , '${req.body.id}')`
        //? 해야될거 req.user.user_id 랑 req.body.id 친구 만들어야됨 DB에
        connection.query(query , (err , rows)=>{
            if(err?.errno === 1062) return res.json({suc : false , msg : '이미 친추되어있습니다'});
            if(err) return res.json({suc : false , msg : '데이터베이스 오류입니다'});
            return res.json({suc : true , msg : '친추완료'});
        })
    }
    ,

    GETFirendList : (req,res)=>{ //? 친구 목록 불러오기
        const query = `
        SELECT U.user_id , U.user_name , U.user_status , U.user_socket , U.user_img , U.user_status_msg
        FROM friend_list F 
        INNER JOIN user_tbl U
        ON F.friend_id = U.user_id
        WHERE F.user_id = '${req.user.user_id}'`
        connection.query(query , (err , rows)=>{
            if(err) return res.json({suc : false , msg : '친구목록을 불러올 수 없습니다'});
            res.json({suc : true , data : rows});
        })
    }

    ,
    POSTMyInfoProfileUpdate : (req,res)=>{
        //? 클라이언트에서 오는 사진 서버에 저장해야됨.
        profileImgUpload(req,res,(err)=>{ //? 저장이 잘됬다면 
            if(err){
                console.log(err);
                return res.json({suc : false , msg : '이미지 저장 오류입니다'});
            } 
            // console.log(req.file.filename); //? 설정한 파일 이름
            const query = `UPDATE user_tbl SET user_img = '/UserProfileImgs/${req.file.filename}' WHERE user_id = '${req.user.user_id}'`;
            connection.query(query , (err,rows)=>{
                if(err){
                    console.log(err); return res.json({suc : false , msg : '이미지 업로드에 실패하였습니다'});  
                } 
                return res.json({suc : true , msg : '이미지 업로드에 성공하였습니다'});
            })
        })
        return
    }
    ,
    
    GETMyInfo : (req,res)=>{
        const query = `SELECT user_name , user_id , user_name , user_tel , user_status , user_sex , user_socket , user_img , user_status_msg FROM user_tbl WHERE user_id='${req.user.user_id}'`;
        connection.query(query , (err,rows)=>{
            if(err) return res.json({suc : false , msg : '사용자를 찾을 수 없습니다'});
            res.json({suc : true , data : rows[0]});
        })
    }

    ,
    PUTrequest : {
        ChangeName : (req,res)=>{ //? 이름변경
            const query = `UPDATE user_tbl SET user_name='${req.body.newName}' WHERE user_id = '${req.user.user_id}'`
            connection.query(query , (err , rows)=>{
                if(err) return res.json({suc : false , msg : 'DB ERROR'});
                return res.json({suc : true , msg : '이름이 수정되었습니다'});
            })
            // console.log(req.body.newName);
            // console.log(req.user); //? req.user이용해서 바꿔야됨
        }
        ,
        StatusMsg : (req,res)=>{ //? body : {newStatusMsg : '...'} 
            const query = `UPDATE user_tbl SET user_status_msg = '${req.body.newStatusMsg}' WHERE user_id = '${req.user.user_id}'`;
            connection.query(query , (err , rows)=>{
                if(err) return res.json({suc : false , msg : 'DB ERROR'});
                return res.json({suc : true , msg : '상태메세지 수정이 완료되었습니다'});
            })
        }
    }



}


module.exports = UserController;