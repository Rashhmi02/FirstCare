const mongoose=require('mongoose')

//creating schema
const medicineSchema=new mongoose.Schema(
    { 
         medicine:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'medicine',
         },
         branch:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'branch',
         },
         price:{
            type:Number,
        },
         batchNumber:{
            type:String,
        },
         quantity:{
            type:Number,
        },
         manufactureDate:{
            type:Date,
        },
         expiryDate:{
             type:String,
         }

    },
    { timestamps: true }
)
//exporting model
module.exports=mongoose.model("medicineBatch",medicineSchema)