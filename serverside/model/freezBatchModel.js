const mongoose=require('mongoose')

//creating schema
const FreezSchema=new mongoose.Schema(
    { 
        
         requestByBranch:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'branch',
         },
         requestToBranch:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'branch',
         },
         batch:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'medicineBatch',
         },
        
         quantity:{
            type:Number,
        },
         status:{
            type:String,
        },
        

    },
    { timestamps: true }
)
//exporting model
module.exports=mongoose.model("freezBatch",FreezSchema)