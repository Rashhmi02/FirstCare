const branchSchema=require('../model/branch_model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const key="Hello"

//insert the data
const BranchInsert=async(req,res)=>{
    try{
        console.log(req.body);
        //destructure fields of client 
        const {branchName,phoneNumber,email,address,password}=req.body;
        // code you added
        const salt=await bcrypt.genSalt(10)
        const secpass=await bcrypt.hash(password,salt)
        console.log(salt)
        //assign values to schema 
        const branchInfo=new branchSchema({branchName,phoneNumber,email,address,password:secpass});
        //save in database
        const branchSaved=await branchInfo.save();
        //respond
        res.send(branchSaved);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}

//fetch the data
const GetBranch = async(req,res)=>{
    try{
        const branch=await branchSchema.find();
        res.send(branch);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
const GetSingleBranch = async(req,res)=>{
    try{
        const branch=await branchSchema.findById(req.params.id);
        res.send(branch);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}
const GetLoginBranch = async(req,res)=>{
    try{
        const branch=await branchSchema.findById(req.user);
        res.send(branch);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}

//delete the data
const deleteBranch = async(req,res) =>{
    try{
        let branch = await branchSchema.findById(req.params.id);
        if(!branch){
            return res.status(404).send("Not Found");
        }
        branch=await branchSchema.findByIdAndDelete(req.params.id)
        res.json({"Success":"Product deleted successfully",branch:branch});//user: user(is the deleted data) 
    }catch(error){
        console.log(error.message); 
        res.status(500).send("Internal some error occured");
    }
}

 const updateBranch = async(req,res)=>{
    const {branchName,phoneNumber,email,address,new_password} = req.body;
   
    try{
       
       
        const newBranch = {};
        if(branchName){ newBranch.branchName = branchName};
        if(phoneNumber){ newBranch.phoneNumber = phoneNumber};
        if(email){ newBranch.email = email};
        if(address){ newBranch.address = address};
        if(new_password){ 
            const salt=await bcrypt.genSalt(10)
            const secpass=await bcrypt.hash(new_password,salt)
            newBranch.password = secpass};

        console.log(newBranch)


        let branch = await branchSchema.findById(req.params.id);
        if(!branch){
            return res.status(404).send("Not Found");
        }
        branch=await branchSchema.findByIdAndUpdate(req.params.id,{$set: newBranch},{new: true})
        res.json({branch});
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
 }

 const BranchLogin=async(req,res)=>{
    try{
        const{email,password}=req.body;
        console.log(req.body)
        const user = await branchSchema.findOne({email})
        if(!user){
            return res.json({success:false,message:'Incorrect email or password'})
        }
        const ismatch=await bcrypt.compare(password,user.password)
        if(!ismatch){
            return res.json('Incorrect Password')
        }
        const data=user.id
        const token=await jwt.sign(data,key)
        const success=true;
        res.json({token,success})
    }
    catch(err){
        console.log(err)
    }
}
module.exports={BranchLogin,BranchInsert,GetBranch,deleteBranch,updateBranch,GetSingleBranch,GetLoginBranch};