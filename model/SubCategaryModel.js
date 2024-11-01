import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

const subCategorySchema = mongoose.Schema({
    _id: Number,
    subCategory_name: {
        type: String,
        required: [true, "Subcategory Name is Required"],
        trim: true,
        lowercase: true,
    },
    category_name: {
        type: String,
        required: [true, "Category Name is Required"],
        trim: true,
        lowercase: true,
    },
    admin_name:{
        type: String,
        required: [true, "Admin Name is Required"],
        trim: true,
        lowercase: true,
    },
    admin_Id: {
        type: Number,
        required: [true, "Admin ID is Required"],
    },
    admin_Img: {
        type:String,
        trim:true,
    }
    // other fields can be added as necessary
});

// Apply unique compound index on category_name and subCategory_name
subCategorySchema.index({ category_name: 1, subCategory_name: 1 }, { unique: true });

// Apply the uniqueValidator plugin to subCategorySchema
// subCategorySchema.plugin(uniqueValidator);

const subCategorySchemaModel = mongoose.model('sub_category_collections', subCategorySchema);
export default subCategorySchemaModel;
