import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

var categorySchema = mongoose.Schema({
    _id:Number,
    category_name:{
        type:String,
        lowercase:true,
        trim:true,
        unique: true,
        required:[true,"Category Name is Required"]
    },

    
})

categorySchema.plugin(mongooseUniqueValidator)

const categorySchemaModel = mongoose.model('category_collection',categorySchema);
export default categorySchemaModel;