const multer = require('multer');
const path = require('path'); 

//* 디렉터리 합치기 path.join(__dirname .. .. .. )

let storage = multer.diskStorage({
    destination : (req,file , cb)=>{ 
        cb(null , path.join(__dirname,'../../public/UserProfileImgs')); //? 업로드 폴더 지정
    },
    filename : (req,file, cb) => { //? 파일이름 지정 
        const ext = path.extname(file.originalname); //? 파일의 확장자 
        cb(null , `${req.user.user_id}_ProfileImg${ext}`); //? 프로필이름사진 정해줌. 
    },
    fileFilter : (req,file,cb)=>{ //? 파일 필터 지정
        const ext = path.extname(file.originalname); //? 확장자 추출
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg'){ //? 사진만가능
            return cb(res.json({suc : false , msg : '사진파일이 아닙니다'}) , false);
        }
        cb(null , true);
    }
})
                                                        //? formData.append('profileImgInput',e.target.files[0]);폼데이터의 key값과 동일해야됨.
const profileImgUpload = multer({storage : storage}).single('profileImgInput');

module.exports = profileImgUpload;