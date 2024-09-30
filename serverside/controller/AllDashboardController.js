const MedicineSchema = require("../model/medicine_model");
const SalesSchema = require("../model/sales_model");
const FreezBatchModelSchema = require("../model/freezBatchModel");

const GetAllDashboardDetails = async (req, res) => {
  try {
    // Get the length of documents for other schemas
    const MedicineInfo = await MedicineSchema.find({ branch: req.user });
    const SaledInfo = await SalesSchema.find({ branch: req.user });
    const RequestInfo = await FreezBatchModelSchema.find({
      requestToBranch: req.user,
    });

    const allData = {
      medicineCount: MedicineInfo.length,
      salesCount: SaledInfo.length,
      requestCount: RequestInfo.length,
    };

    // console.log('allData:', allData);

    res.send(allData);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occurred");
  }
};

module.exports = GetAllDashboardDetails;
