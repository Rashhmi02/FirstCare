const mongoose=require('mongoose')

//creating schema
const branchSchema=new mongoose.Schema(
    {
        branchName:{
            type:String,
        },
        phoneNumber:{
            type:Number,
        },
        email:{
            type:String,
        },
        
        address:{
            type:String,
        },
        password:{
            type:String,
       
         }
    },
    { timestamps: true }
)
//exporting model
module.exports=mongoose.model("branch",branchSchema)