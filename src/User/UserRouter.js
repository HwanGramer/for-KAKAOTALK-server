//? /api/user
const express = require('express');
const UserController = require('./UserController');
const UserRouter = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../PassPort/loginMiddleware');

UserRouter.post('/signUp' , UserController.POSTSignUp); //? 회원가입처리

UserRouter.post('/login' , UserController.POSTLogin); //? 로그인처리

UserRouter.post('/changeName' ,isLoggedIn, UserController.POSTChangeName); //? 이름바꾸기

UserRouter.get('/friendList', UserController.GETFirendList); //? 친구목록 불러오기


UserRouter.post('/friend/add' , UserController.POSTAddFriend);  //!친구 추가 


UserRouter.post('/findUserInfo/tel' , UserController.POSTFindUserInfoTel);  //? 번호로 유저찾기

UserRouter.post('/findUserInfo/id' , UserController.POSTFindUserInfoId);    //? 아이디로 유저찾기

module.exports = UserRouter;