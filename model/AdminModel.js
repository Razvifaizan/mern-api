import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'

const adminSchema = mongoose.Schema({
    _id:Number,
    name:{
        type:String,
        lowercase:true,
        trim:true,
        required:[true,"Name is Required"]
    },
    email:{
        type : String,
        required: [true,"Email is Required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: [true,"Password is Required"],
        maxlength:10,
        minlength:5,
        trim: true,
    },
    mobile:{
        type: String,
        // required:[true,"Mobile is Required"],
        maxlength:10,
        minlength:10,
        trim: true,
    },
    address:{
        type:String,
        // required:[true,"Address is Required"],
        trim:true,
    },
    admin_image:{
        type:String,
        
        trim:true,
    },
    role:String,
    status : String,
    info :String,
})

//apply to uniqueValidator plugin to admin Schema
adminSchema.plugin(uniqueValidator)

const adminSchemaModel = mongoose.model('admin_collection',adminSchema);
export default adminSchemaModel;