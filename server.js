const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); 
const {SESSIONKEY} = require('./src/Config/SESSIONKEY');
const UserRouter = require('./src/User/UserRouter');

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(session({ //? 세션 설정 
    secret : SESSIONKEY , 
    resave : true , 
    saveUninitialized : false ,
    cookie : { //? 쿠키의 관한 설정들 
        httpOnly : true
    }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user' , UserRouter);

app.listen(8080 , ()=>{
    console.log('server On 8080');
})