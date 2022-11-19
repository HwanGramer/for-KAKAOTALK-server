const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../Config/mysql');
const {ComparePw} = require('../User/Encryption');

passport.use(new LocalStrategy({
    usernameField : 'id',
    passwordField : 'pw',
    session : true,
    passReqToCallback : false
},(id , pw , done)=>{
    const sql = `SELECT * FROM user_tbl WHERE user_id='${id}'`;
    connection.query(sql , (err , rows)=>{
        if(err) return done(null , false , '데이터베이스 오류입니다');
        if(!rows[0]) return done(null , false , '존재하지않은 회원입니다.');
        if(!ComparePw(pw , rows[0].user_pw)) return done(null , false ,'비밀번호가 알맞지 않습니다');
        done(null , rows[0] , '로그인 성공');
        // return done(null , rows , {msg : '로그인 성공'});
    })
}))

passport.serializeUser((user , done)=>{
    done(null , user.user_id);
})

passport.deserializeUser((user_id , done)=>{
    const sql = `SELECT * FROM user_tbl WHERE user_id='${user_id}'`
    connection.query(sql , (err , rows)=>{
        if(err) return done(err);
        return done(null , rows);
    })
})

module.exports = passport;