import "../database/dbconfig.js";
import userSchemaModel from "../model/UserModel.js";
import randomstring from "randomstring";
import jwt from "jsonwebtoken";
import path from "path";
import url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import dotenv from "dotenv";
dotenv.config();

// for creating a record or saving a record
// const path = require('path');
// const randomstring = require('randomstring');
// const userSchemaModel = require('../models/userSchema'); // Adjust the import as necessary

export var saveUser = async (req, res) => {
  let userDetail = req.body;
  let user_icon = req.files ? req.files.user_image : null; // Check if req.files exists

  try {
    let userList = await userSchemaModel.find();
    let len = userList.length;

    console.log("User List Length is : " + len);

    let _id = len === 0 ? 1 : userList[len - 1]._id + 1;

    let user_icon_name = null; // Initialize to null

    if (user_icon) { // If an image is provided
      user_icon_name = Date.now() + "-" + randomstring.generate() + "-" + user_icon.name;
      console.log("Product Icon Name : " + user_icon_name);
      
      // Set the image name in userDetail
      userDetail.user_image = user_icon_name;

      let uploadpath = path.join(
        __dirname,
        "../../frontend/public/userIcon",
        user_icon_name
      );
      console.log("Upload Path is : " + uploadpath);
      await user_icon.mv(uploadpath); // Ensure mv is awaited
    }

    userDetail = {
      ...userDetail,
      _id: _id,
      status: 0,
      info: new Date(),
    };
    console.log("Completed User Details is : ", userDetail);

    let user = await userSchemaModel.create(userDetail);

    return res.status(201).json({ status: true, user: user });
  } catch (err) {
    console.log("Exception is : " + err);
    return res.status(500).json({ status: false, Error: err });
  }
};


// login User & Check Data From database
export var loginUser = async (req, res, next) => {
  var id = undefined;
  var name = undefined;
  var email = undefined;
  var mobile = undefined;
  var role = undefined;
  var user_icon = undefined;

  var userDetails = req.body;
  console.log("User Details: " + userDetails);

  try {
    var userResponse = await userSchemaModel.find(userDetails);
    console.log(userResponse);

    var userLength = userResponse.length;

    if (userLength != 0) {
      id = userResponse[0]._id;
      name = userResponse[0].name;
      email = userResponse[0].email;
      mobile = userResponse[0].mobile;
      role = userResponse[0].role;
      user_icon = userResponse[0].user_image;

      // Set token to expire in 30 days
      var jwtToken = jwt.sign(
        { email: userResponse[0].email, _id: userResponse[0]._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      var obj = {
        _id: id,
        name: name,
        email: email,
        mobile: mobile,
        role: role,
        token: jwtToken,
        User_Icon: user_icon,
        role:"user"
      };

      return res
        .status(200)
        .json({ status: true, data: obj, message: "Login Success" });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Email or Password..." });
    }
  } catch (err) {
    console.log("Exception: " + err);
    return res.status(500).json({ status: false, Error: err });
  }
};


// to delete a record from database
// import userSchemaModel from '../model/UserModel.js';

export var deleteUser = async (req, res, next) => {
  var userId = req.body._id; // Assuming the user ID is passed in the request body

  try {
    // Check if the user exists
    var user = await userSchemaModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Delete user
    await userSchemaModel.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (err) {
    console.log("Exception: " + err);
    return res.status(500).json({ status: false, Error: err });
  }
};

// Fetch the data from database (Select)
export var viewAllUser = (req, res, next) => {};
export var loginUserInfo = async (req, res, next) => {
  // var userId = req.body;

  try {
    const user = await userSchemaModel.findById(req.userId);
    //  var user = await userSchemaModel.findById(userId);

    if (!user) {
      return res
      .status(404)
      .json(
        {
             status: false,
            message: "User not found" });
    }
    return res
      .status(200)
      .json({ status: true, user: user, message: "User found successfully" });
  } catch (err) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
};


// ======================================================================================================


export const changeIcon = async (req, res) => {
  // Check if a file is provided in the request
  const user_icon = req.files ? req.files.user_image : null;

  if (!user_icon) {
    return res.status(400).json({ status: false, message: "No image file provided" });
  }

  // Validate file type (optional)
  const allowedExtensions = /png|jpeg|jpg|gif|svg/;
  const extname = path.extname(user_icon.name).toLowerCase();
  if (!allowedExtensions.test(extname)) {
    return res.status(400).json({
      status: false,
      message: "Invalid file type. Only images (png, jpg, jpeg, gif, svg) are allowed.",
    });
  }

  try {
    // Check if the user exists by their ID from the token
    const user = await userSchemaModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Generate a unique file name for the new icon
    const user_icon_name = Date.now() + "-" + randomstring.generate() + extname;
    const uploadpath = path.join(__dirname, "../../frontend/public/userIcon", user_icon_name);
    
    // Move the file to the specified directory
    await user_icon.mv(uploadpath);

    // Update the user record with the new image path
    user.user_image = user_icon_name;
    await user.save();

    return res.status(200).json({ status: true, message: "Icon changed successfully", user });
  } catch (err) {
    console.log("Exception: " + err);
    return res.status(500).json({ status: false, Error: err });
  }
};