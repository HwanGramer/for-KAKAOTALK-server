const multer = require('multer');

let storage = multer.diskStorage({
    destination : (req,file , cb)=>{ //? 업로드 폴더 지정
        console.log(req.user);
        cb(null , 'uploads/');
    },
    filename : (req,file, cb) => { //? 파일이름 지정 
        cb(null , `${Date.now()}_${file.originalname}`);
    },
    fileFilter : (req,file,cb)=>{ //? 파일 필터 지정
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg'){
            return cb(res.json({suc : false , msg : '사진파일이 아닙니다'}) , false);
        }
        cb(null , true);
    }
})

const profileImgUpload = multer({storage : storage}).single('profileImgInput');

module.exports = profileImgUpload;