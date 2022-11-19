exports.isLoggedIn = (req, res, next) => {
    // isAuthenticated()로 검사해 로그인이 되어있으면
    if (req.isAuthenticated()) {
       next(); // 다음 미들웨어
    } else {
       res.json({suc : false , msg : '로그인이 필요합니다'});
    }
 };
  
 exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
       next(); // 로그인 안되어있으면 다음 미들웨어
    } else {
        res.json({ suc : false , msg : '로그아웃 후 요청바랍니다'});
    }
 };