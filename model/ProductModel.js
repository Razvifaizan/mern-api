import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const productSchema = mongoose.Schema({
    _id :Number,
    product_name:{
        type:String,
        lowercase:true,
        required:[true,"Name is required"],
        trim:true,
        unique:true
    },
    product_category:{
        type:String,
        lowercase:true,
        // required:[true,"Product Category is required"],
        trim:true,
    },
    product_sub_category:{
        type:String,
        lowercase:true,
        required:[true,"Product Sub Category is required"],
        trim:true,
    },
    product_description:{
        type:String,
        lowercase:true,
        required:[true,"Product Description is required"],
        trim:true,
    },
    product_image:{
        type:String,
        required:[true,"Product Image is required"],
        trim:true,
    },
    admin_name:{
        type: String,
        // required: [true, "Admin Name is Required"],
        trim: true,
        lowercase: true,
    },
    admin_Id: {
        type: Number,
        // required: [true, "Admin ID is Required"],
    },
    admin_Img: {
        type:String,
        trim:true,
    },
    uid:String,
    info:String,
    likes: {
        type: Number,
        default: 0 // Initializes the likes to 0 for each product
    },
    likedBy: [{ type: Number, ref: 'User' }],
    comments: [
        {
            user_Img: {
                type: String,
                trim: true // Image URL or path
            },
            user: {
                type: String, // User who made the comment
                required: true
            },
            text: {
                type: String, // Comment text
                required: true
            },
            date: {
                type: Date,
                default: Date.now // Timestamp for when the comment was made
            }
        }
    ]
});


productSchema.plugin(uniqueValidator);
const productSchemaModel = mongoose.model('product_collection',productSchema);
export default productSchemaModel;