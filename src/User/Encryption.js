const bcrypt = require('bcrypt');
const saltRounds = 7;

const Encryption = (pw)=>{ //? 암호화 함수 
    return bcrypt.hashSync(pw , saltRounds);
}

const ComparePw = (pw , hash)=>{
    return bcrypt.compareSync(pw , hash);
}

// console.log(Encryption('1'));
// console.log(ComparePw('1' , '#!$!#@!#Ssada'));


module.exports = {Encryption , ComparePw};