const express=require('express');
const router=express.Router();
const middleware = require('../middleware/authenticationRoken')

//importing function from controller
const {SalesInsert,GetSales,GetBrachSales,GetBranchWiseSales} = require('../controller/sales_controller');
// ,deleteMedicine,updateMedicine


router.post('/create',middleware,SalesInsert);
router.get('/getSales',middleware,GetSales);
router.get('/getBranchWiseSales',GetBranchWiseSales);
router.get('/getBrachSales/:id',GetBrachSales);
// router.delete('/deleteMedicine/:id',deleteMedicine);
// router.put('/updateMedicine/:id',updateMedicine);





module.exports=router;