const medicineSchema=require('../model/medicine_model');


//insert the data
const MedicineInsert=async(req,res)=>{
    try{
        console.log(req.body);
        //destructure fields of client 
        const {medicineName,rackNumber,boxNumber,medicineType,description}=req.body;
        //assign values to schema
        const medicineInfo=new medicineSchema({medicineName,rackNumber,boxNumber,medicineType,description,branch:req.user});
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
const GetMedicine = async(req,res)=>{
    try{
        console.log(req.user,'useridd')
        const medicine=await medicineSchema.find({branch:req.user});
        res.send(medicine);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
const GetSingleMedicine = async(req,res)=>{
    try{
        const medicine=await medicineSchema.findById(req.params.id);
        res.send(medicine);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}

//delete the data
const deleteMedicine = async(req,res) =>{
    try{
        let medicine = await medicineSchema.findById(req.params.id);
        if(!medicine){
            return res.status(404).send("Not Found");
        }
        medicine=await medicineSchema.findByIdAndDelete(req.params.id)
        res.json({"Success":"Product deleted successfully",medicine:medicine});//user: user(is the deleted data) 
    }catch(error){
        console.log(error.message); 
        res.status(500).send("Internal some error occured");
    }
}

 const updateMedicine = async(req,res)=>{
    const {medicineName,rackNumber,boxNumber,medicineType,description}=req.body;

    try{
        const newMedicine = {};
        if(medicineName){ newMedicine.medicineName = medicineName};
        if(medicineType){ newMedicine.medicineType = medicineType};
        if(rackNumber){ newMedicine.rackNumber = rackNumber};
        if(boxNumber){ newMedicine.boxNumber = boxNumber};
        if(description){ newMedicine.description = description};

        console.log(newMedicine)


        let medicine = await medicineSchema.findById(req.params.id);
        if(!medicine){
            return res.status(404).send("Not Found");
        }
        medicine=await medicineSchema.findByIdAndUpdate(req.params.id,{$set: newMedicine},{new: true})
        res.json({medicine});
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
 }

module.exports={MedicineInsert,GetMedicine,deleteMedicine,updateMedicine,GetSingleMedicine};