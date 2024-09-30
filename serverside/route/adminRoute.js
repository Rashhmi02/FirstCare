const express=require('express');
const router = express.Router();

//importing function from controller
const {AdminLogin} = require('../controller/admin_controller');


router.post('/adminLogin',AdminLogin);





module.exports=router