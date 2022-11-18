const express = require('express');
const app = express();
const cors = require('cors');

const UserRouter = require('./src/User/UserRouter');

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use('/api/user' , UserRouter);

app.listen(8080 , ()=>{
    console.log('server On 8080');
})