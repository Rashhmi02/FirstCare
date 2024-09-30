const medicineBatchSchema=require('../model/medicne_batch');


//insert the data
const MedicineBatchInsert=async(req,res)=>{
    try{
        console.log(req.body);
        //destructure fields of client 
        const {medicine,batchNumber,price,quantity,manufactureDate,expiryDate}=req.body;
        //assign values to schema
        const medicineInfo=new medicineBatchSchema({medicine,batchNumber,price,quantity,manufactureDate,expiryDate,branch:req.user});
        //save in database
        const medicineSaved=await medicineInfo.save();
        //respond
        res.send(medicineSaved);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}

//fetch the data
const GetAllBatch = async(req,res)=>{
    try{
        console.log(req.user,'useridd')
        const medicine=await medicineBatchSchema.find({branch:req.user}).populate('medicine');
        res.send(medicine);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
const GetAllBranchBatch = async(req,res)=>{
    try{
        const medicine=await medicineBatchSchema.find({branch:req.params.id}).populate('medicine');
        res.send(medicine);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
const GetSameBatchMedicine = async(req,res)=>{
    try {
        const batchNumbers = await medicineBatchSchema.find({branch:req.user}, 'batchNumber'); // Retrieve only batch numbers
        res.json(batchNumbers);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
const GetSingleMedicine = async(req,res)=>{
    try{
        const medicine=await medicineBatchSchema.findById(req.params.id);
        res.send(medicine);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}

//delete the data
const DeleteBatch = async(req,res) =>{
    try{
        let medicine = await medicineBatchSchema.findById(req.params.id);
        if(!medicine){
            return res.status(404).send("Not Found");
        }
        medicine=await medicineBatchSchema.findByIdAndDelete(req.params.id)
        res.json({"Success":"Product deleted successfully",medicine:medicine});//user: user(is the deleted data) 
    }catch(error){
        console.log(error.message); 
        res.status(500).send("Internal some error occured");
    }
}



module.exports={MedicineBatchInsert,GetSameBatchMedicine,GetAllBatch,DeleteBatch,GetAllBranchBatch};