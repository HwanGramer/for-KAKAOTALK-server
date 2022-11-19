# 카카오톡 구현하기 개발일지

공부중이라 아직 많이 미숙합니다. 코드 따끔한 피드백 받고싶습니다.

<br>

# CLIENT
1. [로그인페이지](#login)
2. [회원가입페이지](#signup)

<br>

# SERVER

1. [/api/user/login 로그인요청](#post-api-user-login)
2. [/api/user/signUp 회원가입요청](#post-api-user-signup)

<br>

***

<br>
<br>

###### login
# LoginPage.js
* 로그인 페이지 
* URL : '/'
* 아이디와 비밀번호를 사용자에게 받아서 서버 '/api/user/login' 로 전송

```
useEffect(()=>{
    if(id.length > 7 && pw.length > 7)setBtnClass('LoginPageSucLoginBtn');
    else setBtnClass('LoginPageLoginBtn');
},[id , pw])
```
아이디와 비밀번호를 8글자 이상입력하면 버튼의 디자인이 바뀐다. 

```
axios.post('/api/user/login' , loginInfo).then((result)=>{
    if(!result.data.suc) return alert(result.data.msg);
    alert(result.data.msg);
    return navi('/main');
})
```
로그인 버튼을 눌렀을때 로그인 요청 코드이다. result.data.suc은 서버에서 오는 데이터로 false시 alert메세지로 로그인이 되지않은 이유를 알려준다. true시 '/main'페이지로 넘어가게된다. 

<img src='https://user-images.githubusercontent.com/100682468/202847973-444d97b8-214b-4bf7-9054-6bab0119f094.png' width='350'>

<br>
<br>

*** 

<br>
<br>

###### signup
# SignUpPage.js
* 회원가입페이지
* URL : '/signUp'
* 아이디 , 비밀번호 , 비밀번호확인 , 전화번호 입력후 가입하기 클릭시 '/api/user/signUp'로 회원가입요청
* 로그인페이지와 동일하게 입력란이 조건에 만족해야 가입하기 버튼이 디자인이 바뀌며 활성화됨.

```
const signUpBtnClicked = ()=>{              //? 회원가입 버튼 클릭 
    if(btnClass === 'LoginPageLoginBtn') return
    if(id.trim().length < 7) return alert('계정의 길이가 알맞지 않습니다 8자이상 입력해주세요');
    if(pw.length < 7) return alert('패스워드 길이가 알맞지 않습니다 8자이상 입력해주세요');
    if(pw !== pwConfirm) return alert('패스워드가 동일하지 않습니다');

    const userInfo = {id : id.trim() , pw , pwConfirm , tel : tel.trim()};
    axios.post('/api/user/signUp' , userInfo).then((result)=>{
        if(!result.data.suc) return alert(result.data.msg);
        alert(result.data.msg);
        navi('/');
    });
}
```
회원가입시 아이디 , 전화번호 공백제거 후 8자리 이상입력시 회원가입 요청가능 '/api/user/signUp'로 POST요청

<img src='https://user-images.githubusercontent.com/100682468/202847944-20dc09e4-c965-44b1-bb53-4b78bc1263e7.png' width='350'>

<br>
<br>

*** 

<br>
<br>

###### post-api-user-login
# /api/user/login 로그인요청

* passport.js를 사용하여 로그인 처리
* MySQL은 일단 쿼리문 ORM으로 대체 할 예정
* bcrypt라이브러리를 사용하여 암호화된 패스워드 비교(Encryption.js)

```
UserRouter.post('/login' , UserController.POSTLogin); 
```

로그인 컨트롤러
```
POSTLogin : (req,res,next)=>{
    passport.authenticate('local' , (err , user , info)=>{
        if(err)return res.json({suc : false , msg : info});
        if(!user)return res.json({suc : false , msg : info});
        return req.logIn(user , (loginrr)=>{
            if(loginrr) return res.json({suc : false , msg : '로그인에러'});
            return res.json({suc : true , msg : info}); //? 로그인 성공
        })

    })(req,res,next)
}
```
passport 구성 
```
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
```
session에는 사용자id를 저장해서 인증함.


<br>
<br>

*** 

<br>
<br>

###### post-api-user-signup
# /api/user/signUp 회원가입요청

* 클라이언트에서 오는 유저정보 저장
* DB UNIQUE 중복시 err.errono 에러번호를 이용하여 처리
* bcrypt라이브러리를 사용하여 비밀번호 암호화 (Encryption.js 암호화하는 모듈을 따로 만듬)

```
UserRouter.post('/signUp' , UserController.POSTSignUp);
```
회원가입 컨트롤러
```
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
```