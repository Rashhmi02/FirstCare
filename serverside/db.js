const mongoose=require('mongoose')

const URI="mongodb://localhost:27017/medical"

const dbconnection=async()=>{
    try{
        await mongoose.connect(URI)
        console.log("Database connnection successfull")
    }catch(err){
        console.log(err)
    }
}


module.exports=dbconnection;