const mongoose=require('mongoose')

//creating schema
const medicineSchema=new mongoose.Schema(
    {
        medicineName:{
            type:String,
        },
        medicineType:{
            type:String,
        },
       
        rackNumber:{
            type:String,
        },
        
        boxNumber:{
            type:String,
        },
        description:{
            type:String,
        },
        
        
         branch:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'branch',
         }
    },
    { timestamps: true }
)
//exporting model
module.exports=mongoose.model("medicine",medicineSchema)