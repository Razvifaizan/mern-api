import "../database/dbconfig.js";
import categorySchemaModel from "../model/CategoryModel.js";

export var saveCategory = async (req,res,next)=>{
     var catDetails = req.body;
    console.log("Category Details : "+catDetails);

    var catList =await categorySchemaModel.find();
    var len = catList.length;
    console.log("Category List Length : "+len);

    var _id = len == 0 ? 1 : catList[len-1]._id+1;
    console.log("Id is : "+_id);

    catDetails = {...catDetails,"_id":_id};
    console.log("Completed Category Details is : "+catDetails);

    try
    {
        var catResp = await categorySchemaModel.create(catDetails)
        return res.status(200).json({"status":true,"category":catResp,"message":"Category Saved"});
    }
    catch(err)
    {
        console.log("Save Category Error is : "+err);
        return res.status(400).json({"status":false,"message":'Category Not Save'});
    }
}



export var updateCategory = async (req, res, next) => {
    // const { _id, category_name } = req.body;

    try {
        const { id } = req.params;

        console.log(id)
        const updatedDetails = req.body;

        const updatedCategory = await categorySchemaModel.findByIdAndUpdate(id, updatedDetails, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ status: false, message: "Subcategory not found" });
        }

        res.status(200).json({ status: true, subcategory: updatedCategory, message: "Subcategory updated successfully" });
    } catch (error) {
        console.error("Update Subcategory error:", error);
        res.status(500).json({ status: false, message: "Failed to update subcategory" });
    }
};

export var deleteCategory = async (req, res, next) => {
    const { id } = req.params;
console.log(id)// ===> ye undefined kiyo a raha hai
    try {
        // Check if the category exists
        const category = await categorySchemaModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ "status": false, "message": "Category not found" });
        }

        // Delete categor

        return res.status(200).json({ "status": true, "message": "Category deleted successfully" });
    } catch (err) {
        console.log("Exception: " + err);
        return res.status(500).json({ "status": false, "Error": err });
    }
}

export var viewAllCategoryList = async (req,res,next)=>{
    
     var CatList =await categorySchemaModel.find();
    var len = CatList.length;
    console.log("Category Length is : "+len)
    
    if(CatList != 0)
    {
        return res.status(200).json({"status":true,"subCatList":CatList})
    }
    else
    {
        return res.status(400).json({"status":false,"subCatList":"Sub Category Data Not Present"})
    }
}
export var viewCategoryList = (req,res,next)=>{
    
}