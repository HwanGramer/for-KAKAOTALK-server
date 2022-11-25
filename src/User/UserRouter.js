//? /api/user
const express = require('express');
const UserController = require('./UserController');
const UserRouter = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../PassPort/loginMiddleware');

UserRouter.put('/changeName' ,isLoggedIn, UserController.PUTrequest.ChangeName); //? 이름바꾸기

UserRouter.put('/statusMsg' , isLoggedIn , UserController.PUTrequest.StatusMsg); //? 상태메세지 바꾸기


UserRouter.post('/signUp' , UserController.POSTSignUp); //? 회원가입처리

UserRouter.post('/login' , UserController.POSTLogin); //? 로그인처리


UserRouter.get('/myinfo' ,isLoggedIn, UserController.GETMyInfo); //? 나의 정보 가져오기

UserRouter.post('/myinfo/profileImg' , isLoggedIn ,UserController.POSTMyInfoProfileUpdate); //? 프로필사진 업데이트


UserRouter.get('/friend/list',isLoggedIn, UserController.GETFirendList); //? 친구목록 불러오기

UserRouter.post('/friend/add' ,isLoggedIn, UserController.POSTAddFriend);  //? 친구 추가 


UserRouter.post('/check' , isLoggedIn , UserController.POSTUserCheck )//? 유저가 존재하는지 유저ID로 체크 userId

UserRouter.post('/findUserInfo/tel' ,isLoggedIn, UserController.POSTFindUserInfoTel);  //? 번호로 유저찾기

UserRouter.post('/findUserInfo/id' ,isLoggedIn, UserController.POSTFindUserInfoId);    //? 아이디로 유저찾기

module.exports = UserRouter;