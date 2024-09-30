//step1:importing
const mongoose=require('mongoose')

//step2:creating schema
const adminSchema=new mongoose.Schema(
    {
       
        
        username:{
            type:String,
        },
        password:{
            type:String,
        },
        
    },
    { timestamps: true }
)
//step3: exporting and creating model
module.exports=mongoose.model("admin",adminSchema)