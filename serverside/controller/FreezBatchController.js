const FreezSchema = require("../model/freezBatchModel");

//insert the data
const FreezBatchInsert = async (req, res) => {
  try {
    console.log(req.body);
    //destructure fields of client
    const { batch, requestToBranch,quantity } = req.body;
    //assign values to schema
    const medicineInfo = new FreezSchema({
      batch,
      quantity,
      requestByBranch: req.user,
      requestToBranch,
      status: "pending",
    });
    //save in database
    const medicineSaved = await medicineInfo.save();
    //respond
    res.send(medicineSaved);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal some error occured");
  }
};

//fetch the data
const GetAllBranchRequest = async (req, res) => {
  try {
    console.log(req.user, "useridd");
    const medicine = await FreezSchema.find({ requestByBranch: req.user })
      .populate("batch")
      .populate({
        path: "batch",

        populate: {
          path: "medicine",
        },
      })
      .populate({
        path: "batch",

        populate: {
          path: "branch",
        },
      });
    res.send(medicine);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal some error occured");
  }
};
const GetLoginBranchRequest = async (req, res) => {
  try {
    console.log(req.user, "useridd");
    const medicine = await FreezSchema.find({ requestToBranch: req.user }).populate("batch")
    .populate({
      path: "batch",

      populate: {
        path: "medicine",
      },
    })
    .populate({
      path: "batch",

      populate: {
        path: "branch",
      },
    });
     
    res.send(medicine);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal some error occured");
  }
};


const UpdateRequestStatus = async(req,res)=>{
    const {status} = req.body;
   
    try{
       
       
        const newBranch = {};
        if(status){ newBranch.status = status};
      


        let branch = await FreezSchema.findById(req.params.id);
        if(!branch){
            return res.status(404).send("Not Found");
        }
        branch=await FreezSchema.findByIdAndUpdate(req.params.id,{$set: newBranch},{new: true})
        res.json({branch});
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
 }


module.exports = {
  FreezBatchInsert,
  GetAllBranchRequest,
  GetLoginBranchRequest,
  UpdateRequestStatus
};
