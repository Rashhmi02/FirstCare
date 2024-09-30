const mongoose=require('mongoose')

//creating schema
const salesSchema=new mongoose.Schema(
    {
        customerName:{
            type:String,
        },
        phoneNumber:{
            type:Number,
        },
        medicines:[],
        
        total:{
            type:Number,
        },
         branch:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'branch',
         }
    },
    { timestamps: true }
)
//exporting model
module.exports=mongoose.model("sales",salesSchema)