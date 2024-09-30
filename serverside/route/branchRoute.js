const express=require('express');
const router=express.Router();
//importing function from controller
const middleware = require('../middleware/authenticationRoken')
const {BranchLogin,BranchInsert,GetBranch,deleteBranch,updateBranch,GetSingleBranch,GetLoginBranch} = require('../controller/branch_controller');
const {MedicineBatchInsert,GetSameBatchMedicine,GetAllBatch,DeleteBatch,GetAllBranchBatch} = require('../controller/BatchController');
const {FreezBatchInsert,GetAllBranchRequest,GetLoginBranchRequest,UpdateRequestStatus} = require('../controller/FreezBatchController');
const GetAllDashboardDetails = require('../controller/AllDashboardController');



router.post('/branchInsert',BranchInsert);
router.get('/getBranch',GetBranch);
router.get('/getLoginBranch',middleware,GetLoginBranch);
router.delete('/deleteBranch/:id',deleteBranch);
router.put('/updateBranch/:id',updateBranch);
router.get('/GetSingleBranch/:id',GetSingleBranch);
router.post('/branchLogin',BranchLogin);



//Batch 
router.post('/medicineBatchInsert',middleware,MedicineBatchInsert);
router.get('/getBatchNumbers',middleware,GetSameBatchMedicine);
router.get('/getAllBatch',middleware,GetAllBatch);
router.get('/getAllBranchBatch/:id',GetAllBranchBatch);
router.delete('/deleteBatch/:id',DeleteBatch);

//Freez Medicine
router.post('/freezBatchInsert',middleware,FreezBatchInsert);
router.get('/getAllBranchRequest',middleware,GetAllBranchRequest);
router.get('/getLoginBranchRequest',middleware,GetLoginBranchRequest);
router.put('/updateRequestStatus/:id',UpdateRequestStatus);


//Dashboard Details
router.get('/getDashboardDetails',middleware,GetAllDashboardDetails);



module.exports=router;