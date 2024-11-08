import "../database/dbconfig.js";
import subCategorySchemaModel from "../model/SubCategaryModel.js";

export var saveSubCategory = async (req, res, next) => {
    var subCategoryDetails = req.body;
    console.log(subCategoryDetails);

    var subCatList = await subCategorySchemaModel.find();
    var len = subCatList.length;

    var _id = len == 0 ? 1 : subCatList[len - 1]._id + 1;
    subCategoryDetails = { ...subCategoryDetails, "_id": _id };

    try {
        var subcatResp = await subCategorySchemaModel.create(subCategoryDetails);
        return res.status(200).json({ "status": true, "subcategory": subcatResp, "message": "Subcategory Saved" });
    } catch (err) {
        console.log("Save Subcategory error: ", err);
        if (err.code === 11000) { // Duplicate key error
            return res.status(400).json({ "status": false, "message": "Playlist already exists within the same Course" });
        }
        return res.status(500).json({ "status": false, "message": err });
    }
};

export var deleteSubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedSubCategory = await subCategorySchemaModel.findByIdAndDelete(id);
        
        if (!deletedSubCategory) {
            return res.status(404).json({ "status": false, "message": "Subcategory not found" });
        }

        res.status(200).json({ "status": true, "message": "Subcategory deleted successfully" });
    } catch (error) {
        console.log("Delete Subcategory error: ", error);
        res.status(500).json({ "status": false, "message": "Failed to delete subcategory" });
    }
};

export const updateSubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedDetails = req.body;

        const updatedSubCategory = await subCategorySchemaModel.findByIdAndUpdate(id, updatedDetails, { new: true });

        if (!updatedSubCategory) {
            return res.status(404).json({ status: false, message: "Subcategory not found" });
        }

        res.status(200).json({ status: true, subcategory: updatedSubCategory, message: "Subcategory updated successfully" });
    } catch (error) {
        console.error("Update Subcategory error:", error);
        res.status(500).json({ status: false, message: "Failed to update subcategory" });
    }
};


export var viewAllSubCategoryList = async (req, res, next) => {
    try {
        const subCatList = await subCategorySchemaModel.find();
        
        if (subCatList.length > 0) {
            return res.status(200).json({ "status": true, "subCatList": subCatList });
        } else {
            return res.status(400).json({ "status": false, "message": "Subcategory data not present" });
        }
    } catch (error) {
        console.log("View All Subcategory List error:", error);
        res.status(500).json({ "status": false, "message": "Failed to fetch subcategory list" });
    }
};

export var viewSubCategoryList = async (req, res, next) => {
    try {
        const { category } = req.body;
        console.log("Received category: ", category);

        const subCategories = await subCategorySchemaModel.find({ category_name: category });

        if (subCategories.length === 0) {
            return res.status(404).json({ "status": false, "message": "Subcategories not found" });
        }

        res.status(200).json({ "status": true, "subCategories": subCategories });
    } catch (error) {
        console.log("Error fetching subcategories: ", error);
        res.status(500).json({ "status": false, "message": "Failed to fetch subcategories" });
    }
};

export const viewSubCategoryListbyAdmin = async (req, res, next) => {
    try {
        const teacherId = parseInt(req.params.teacherId, 10);

        if (isNaN(teacherId)) {
            return res.status(400).json({ status: false, message: "Invalid teacherId" });
        }

        const subCategories = await subCategorySchemaModel.find({ admin_Id: teacherId });

        if (subCategories.length === 0) {
            return res.status(404).json({ status: false, message: "Subcategories not found" });
        }

        res.status(200).json({ status: true, subCategories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Failed to fetch subcategories" });
    }
};

export const viewSubCategoryListbyTeacher = async (req, res, next) => {
    try {
        const teacherId = await subCategorySchemaModel.findById(req.userId);

        const subCategories = await subCategorySchemaModel.find({ admin_Id: teacherId });

        if (subCategories.length === 0) {
            return res.status(404).json({ status: false, message: "Subcategories not found" });
        }

        res.status(200).json({ status: true, subCategories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Failed to fetch subcategories" });
    }
};
