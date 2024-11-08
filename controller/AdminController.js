import '../database/dbconfig.js'
import adminSchemaModel from '../model/AdminModel.js';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken'
import path from 'path'
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import dotenv from 'dotenv';
dotenv.config();
import { sendApprovalEmail } from '../emailService.js';
import Message from '../model/MsgModel.js';

// const path = require('path');
// const randomstring = require('randomstring');
// const adminSchemaModel = require('path-to-admin-model'); // Ensure your model is properly imported

export var saveAdmin = async (req, res, next) => {
    try {
        const teacherDetail = req.body;
        const user_icon = req.files ? req.files.user_icon : null; // Check if the user_icon exists

       

        // Find current teacher list and calculate the new ID
        const teacherList = await adminSchemaModel.find();
        const len = teacherList.length;
        const _id = len === 0 ? 1 : teacherList[len - 1]._id + 1;

        // Generate a unique name for the uploaded file
        if (user_icon) { 
        const user_icon_name = `${Date.now()}-${randomstring.generate()}-${user_icon.name}`;
        console.log("Admin Icon Name: ", user_icon_name); 

teacherDetail.admin_image = user_icon_name

let uploadpath = path.join(
        __dirname,
        "../../ui/public/userIcon",
        user_icon_name
      );
      console.log("Upload Path is : " + uploadpath);
      await user_icon.mv(uploadpath); // Ensure mv is awaited


}
        // Create the new teacher object with all the details
        const newTeacherDetail = {
            ...teacherDetail,
            _id,
            status: "pending", // Set status to pending
            role: "admin",
            info: new Date(),
        };

        // Save the teacher's data in the database
        const user = await adminSchemaModel.create(newTeacherDetail);

        // Define the path to save the uploaded image
        
        // Move the uploaded file to the desired location
       

        // Return success response
        return res.status(201).json({ status: true, user });
    } catch (err) {
        console.log("Exception is: ", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};


//login Admin & Check Data From dataBase
export var loginAdmin = async (req, res, next) => {
    var id, name, email, mobile, role, user_icon;

    var userDetails = req.body;
    console.log("User Details: " + JSON.stringify(userDetails));

    try {
        var userResponse = await adminSchemaModel.findOne({ email: userDetails.email, password: userDetails.password });
        console.log("User Response: " + JSON.stringify(userResponse));
        
        if (!userResponse) {
            return res.status(404).json({ "status": false, "message": "Invalid Email or Password..." });
        }

        if (userResponse.status !== "active") {
            return res.status(403).json({ "status": false, "message": "Your account is pending approval. Please wait for admin approval." });
        }

        // Extract user details if active
        id = userResponse._id;
        name = userResponse.name;
        email = userResponse.email;
        mobile = userResponse.mobile;
        role = userResponse.role;
        user_icon = userResponse.admin_image;

        // Set token to expire in 30 days
        var jwtToken = jwt.sign({ email: userResponse.email, _id: userResponse._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        var obj = { "_id": id, "name": name, "email": email, "mobile": mobile, "role": role, "token": jwtToken, "User_Icon": user_icon };
        console.log("Response Object: " + JSON.stringify(obj));

        return res.status(200).json({ "status": true, "data": obj, "message": "Login Success" });

    } catch (err) {
        console.log("Exception: " + err);
        return res.status(500).json({ "status": false, "Error": err });
    }
};


//if you want to update a record in database
export var updateAdmin = (req,res,next)=>{
    
}

// login admin info

export var loginAdminInfo = async (req,res,next)=>{
    try{
        const admin = await adminSchemaModel.findById(req.userId);
//  var user = await userSchemaModel.findById(userId);
console.log(admin)
    
    if (!admin) {
            return res.status(404).json({ "status": false, "message": "admin ____ not found" });
        }
        return res.status(200).json({ "status": true, "admin": admin,"message": "admin found successfully" });

    }
    catch(err){
        return res.status(404).json({ "status": false, "message": "error hai yar" });
    } 
}

// to delete a record from database
export var deleteAdmin = (req,res,next)=>{
    
}
//Fetch the data from database(Select)
export var viewAllAdmin = async (req,res,next)=>{
try {
        // const teacherId = req.params.id;

        const teacher = await adminSchemaModel.find({role:"admin" });
        if (!teacher) {
            return res.status(404).json({ status: false, message: "Teacher not found." });
        }

        return res.status(200).json({ status: true ,teachers:teacher });
    } catch (err) {
        console.log("Exception is : " + err);
        return res.status(500).json({ status: false, "Error": err });
    }

    
}

// =================================> __Admin__ <==================================================



// Example endpoint to approve teacher
export const approveTeacher = async (req, res) => {
    const { id: teacherId } = req.params; // Correctly extract 'id' from req.params

    console.log('Request Params:', req.params);
    console.log('Teacher ID:', teacherId);

    try {
        if (!teacherId) {
            return res.status(400).json({ status: false, message: 'Teacher ID is missing' });
        }

       
        // Update teacher's status directly
        const result = await adminSchemaModel.findByIdAndUpdate(
            teacherId,
            { status: 'active' },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ status: false, message: 'Teacher not found' });
        }

        // Send approval email
        await sendApprovalEmail(result.email, result.name);
        console.log(result.email)
        console.log(result.name)

        return res.status(200).json({ status: true, message: 'Teacher approved and notified' });
    } catch (error) {
        console.error('Error approving teacher:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};


export var viewPandingTeacher = async (req, res, next) => {
    try {
        // const teacherId = req.params.id;

        const teacher = await adminSchemaModel.find({ status:"pending" });
        if (!teacher) {
            return res.status(404).json({ status: false, message: "Teacher not found." });
        }

        return res.status(200).json({ status: true ,teachers:teacher });
    } catch (err) {
        console.log("Exception is : " + err);
        return res.status(500).json({ status: false, "Error": err });
    }
};

export var viewActiveTeacher = async (req,res,next)=>{
    try {
        const teacher = await adminSchemaModel.find({status:"active"});

        if (!teacher) {
             return res.status(404).json({ status: false, message: "Teacher not found." });
        }
         return res.status(200).json({ status: true ,teachers:teacher });
    } catch (error) {
        console.log("Exception is : " + err);
        return res.status(500).json({ status: false, "Error": err });
    }
}





export const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    const newMessage = new Message({ senderId, receiverId, message });

    try {
        await newMessage.save();
        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ success: false, message: 'Error sending message' });
    }
};

/**
 * Get Chat History
 */
export const getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;

    try {
        console.log("Sender ID:", senderId, "Receiver ID:", receiverId);

        // Query to find messages where sender and receiver match in either direction
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 }); // Sort by time if needed for chronological order

        if (!messages || messages.length === 0) {
            return res.status(404).json({ error: "No messages found" });
        }

        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export var viewMainAdmin = async (req,res,next)=>{
    try {
        const teacher = await adminSchemaModel.find({role:"main-admin"});

        if (!teacher) {
             return res.status(404).json({ status: false, message: "Teacher not found." });
        }
         return res.status(200).json({ status: true ,teachers:teacher });
    } catch (error) {
        console.log("Exception is : " + err);
        return res.status(500).json({ status: false, "Error": err });
    }
}






// ===================================> __Admin__ <==================================================


export const changeIcon = async (req, res) => {
  // Check if a file is provided in the request
  const user_icon =  req.files.user_icon  // Change to 'user_icon'

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
    const user = await adminSchemaModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Generate a unique file name for the new icon
    const user_icon_name = Date.now() + "-" + randomstring.generate() + extname;
    const uploadpath = path.join(__dirname, "../../frontend/public/userIcon", user_icon_name);
    
    // Move the file to the specified directory
    await user_icon.mv(uploadpath);

    // Update the user record with the new image path
    user.admin_image = user_icon_name;
    await user.save();
    console.log(user_icon_name)

    return res.status(200).json({ status: true, message: "Icon changed successfully", user });
  } catch (err) {
    console.log("Exception: " + err);
    return res.status(500).json({ status: false, Error: err });
  }
};