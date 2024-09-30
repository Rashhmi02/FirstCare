const salesSchema=require('../model/sales_model');
const batchSchema=require('../model/medicne_batch');


//insert the data
const SalesInsert = async (req, res) => {
    try {
        console.log(req.body);
        
        // Destructure fields from the request body
        const { customerName, phoneNumber, medicines, total } = req.body;
        console.log("Medicines:", medicines);
        
        // Prepare update promises for each medicine batch
        const updatePromises = medicines.map((medicine) => 
            batchSchema.findByIdAndUpdate(
                medicine.   id,
                { $inc: { quantity: -medicine.quantity } },
                { new: true }
            )
        );

        // Execute all update promises concurrently
        await Promise.all(updatePromises);

        // Create a new sales record
        const salesInfo = new salesSchema({
            customerName,
            phoneNumber,
            medicines,
            total,
            branch: req.user
        });

        // Save the sales record to the database
        const salesSaved = await salesInfo.save();

        // Send the saved sales record as a response
        res.send(salesSaved);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal server error occurred");
    }
};


//fetch the data
const GetSales = async(req,res)=>{
    try{
        console.log(req.user,'useridd')
        const sales=await salesSchema.find({branch:req.user});
        res.send(sales);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
//fetch the data
const GetBranchWiseSales = async(req,res)=>{
    try{
        console.log(req.user,'useridd')
        const sales=await salesSchema.find();
        res.send(sales);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
const GetBrachSales = async(req,res)=>{
    try{
        const sales=await salesSchema.find({branch:req.params.id});
        res.send(sales);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
// const GetSingleMedicine = async(req,res)=>{
//     try{
//         const medicine=await medicineSchema.findById(req.params.id);
//         res.send(medicine);
//     }catch(error){
//         console.log(error.message);
//         res.status(500).send("Internal some error occured");
//     }
// }

//delete the data
// const deleteMedicine = async(req,res) =>{
//     try{
//         let medicine = await medicineSchema.findById(req.params.id);
//         if(!medicine){
//             return res.status(404).send("Not Found");
//         }
//         medicine=await medicineSchema.findByIdAndDelete(req.params.id)
//         res.json({"Success":"Product deleted successfully",medicine:medicine});//user: user(is the deleted data) 
//     }catch(error){
//         console.log(error.message); 
//         res.status(500).send("Internal some error occured");
//     }
// }

//  const updateMedicine = async(req,res)=>{
//     const {medicineName,rackNumber,boxNumber,quantity,manufactureDate,expiryDate} = req.body;
//     try{
//         const newMedicine = {};
//         if(medicineName){ newMedicine.medicinename = medicinename};
//         if(batchNumber){ newMedicine.batchNumber = batchNumber};
//         if(rackNumber){ newMedicine.rackNumber = rackNumber};
//         if(boxNumber){ newMedicine.boxNumber = boxNumber};
//         if(quantity){ newMedicine.quantity = quantity};
//         if(manufactureDate){ newMedicine.manufactureDate = manufactureDate};
//         if(expiryDate){ newMedicine.expiryDate = expiryDate};



//         console.log(newMedicine)


//         let medicine = await medicineSchema.findById(req.params.id);
//         if(!medicine){
//             return res.status(404).send("Not Found");
//         }
//         medicine=await medicineSchema.findByIdAndUpdate(req.params.id,{$set: newMedicine},{new: true})
//         res.json({medicine});
//     }catch(error){
//         console.log(error.message);
//         res.status(500).send("Internal some error occured");
//     }
//  }





module.exports={SalesInsert,GetSales,GetBrachSales,GetBranchWiseSales};
// ,deleteMedicine,updateMedicine,GetSingleMedicine