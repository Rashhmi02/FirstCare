const express=require('express');
const router=express.Router();
const middleware = require('../middleware/authenticationRoken')

//importing function from controller
const {MedicineInsert,GetMedicine,deleteMedicine,updateMedicine,GetSingleMedicine} = require('../controller/medicine_controller');



router.post('/medicineInsert',middleware,MedicineInsert);
router.get('/getMedicine',middleware,GetMedicine);
router.get('/getSingleMedicine/:id',GetSingleMedicine);
router.delete('/deleteMedicine/:id',deleteMedicine);
router.put('/updateMedicine/:id',updateMedicine);






module.exports=router;