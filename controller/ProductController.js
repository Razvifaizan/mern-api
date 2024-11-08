import '../database/dbconfig.js'
import productSchemaModel from '../model/ProductModel.js'
import randomString from 'randomstring'
import path from 'path'
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export var saveProduct = async (req,res,next)=>{
    
    var product_details = req.body;
    var product_icon =req.files.product_image;

    console.log("Product Details : "+product_details);
    console.log("Product Icon : "+product_icon);  

    var product_list = await productSchemaModel.find();
    var len = product_list.length;
    var _id = len ==0?1:product_list[len-1]._id+1;

    var product_icon_name = Date.now()+"-"+randomString.generate()+"-"+product_icon.name;
    console.log("Produc Icon Name : "+product_icon_name)
 
    product_details = {...product_details,"_id":_id,"product_image":product_icon_name,"likes":0,"info":Date()};
    console.log("After Icon Product Details : "+product_details)
    try
    {
        var pro_deatils = await productSchemaModel.create(product_details);
        console.log("Inside try : Product Deatils"+pro_deatils);
        var uploadpath = path.join(__dirname,"../../frontend/public/lecture",product_icon_name);
        console.log("Upload Path is : "+uploadpath)
        product_icon.mv(uploadpath);
        res.status(201).json({"status":true,"message":"Product Details Save"});
    
    }
    catch(error)
    {
        console.log("Error : "+error);
    res.status(500).json({"status":false,"message":"Product Details Not Saved..."});
    }
  

}
export var addComment = async (req, res, next) => {
    try {
        const { productId, user, text,user_Img } = req.body;
        console.log("Received productId: ", productId);

        // Find the product by ID
        const product = await productSchemaModel.findById(productId);

       

        if (!product) {
            return res.status(404).json({ "status": false, "message": "Product not found" });
        }

        // Create a new comment object
        const newComment = {
            user_Img,
            user,
            text,
            
            date: new Date()
        };

        // Add the new comment to the product's comments array
        product.comments.push(newComment);

        // Save the updated product
        await product.save();

        res.status(200).json({ "status": true, "message": "Comment added successfully", "comments": product.comments });
    } catch (error) {
        console.log("Error adding comment: ", error);
        res.status(500).json({ "status": false, "message": "Failed to add comment" });
    }
};


export var viewComment = async (req,res,next) =>{
     const { productId} = req.body;
    //  const {user_Img} = req.body
        console.log("Received productId: ===>< ", productId);

        // Find the product by ID
        const product = await productSchemaModel.findById(productId);

       

        if (!product) {
            return res.status(404).json({ "status": false, "message": "Product not found" });
        }

        try {
            
        res.status(200).json({ "status": true, "message": "Comment added successfully", "comments": product.comments });
   
        } catch (error) {
            res.status(404).json({"status": false, "message": "Comment Not added",})
            console.log(error)
        }
}

export var updateProduct = (req,res,next)=>{
    
}

export var deleteProduct = (req,res,next)=>{
    
}

export var viewAllProductDetailsList = async (req,res,next)=>{
    
    var product_list = await productSchemaModel.find();
    var len = product_list.length;
    if(len != 0)
    {
        return res.status(201).json({"message":"Product Found",product_list:product_list});
    }
    else
    {
        return res.status(400).json({"message":"Product List Not Found"})
    }
}

export var viewProduct = async (req,res,next)=>{
 try {
        const { subcategory } = req.body;
        console.log("Received category **: ", subcategory);

        // Find subcategories associated with the given category
        const product = await productSchemaModel.find({ product_sub_category: subcategory });//product_sub_category


        if (product.length === 0) {
            return res.status(404).json({ "status": false, "message": "Subcategories not found" });
        }

        res.status(200).json({ "status": true, "product": product });
    } catch (error) {
        console.log("Error fetching product: ", error);
        res.status(500).json({ "status": false, "message": "Failed to fetch product" });
    }
}

// ===================================================================================

export var viewProductbuid = async (req,res,next)=>{
 try {
        // const { productId } = req.body;
        // console.log("Received category **: ", productId);

        // // Find subcategories associated with the given category
        // const product = await productSchemaModel.find({ product_sub_category: subcategory });//product_sub_category

const product = await productSchemaModel.findById(req.userId)


        if (product.length === 0) {
            return res.status(404).json({ "status": false, "message": "product not found not found" });
        }

        res.status(200).json({ "status": true, "product": product });
    } catch (error) {
        console.log("Error fetching product: ", error);
        res.status(500).json({ "status": false, "message": "Failed to fetch product" });
    }
}

// Backend: Increment likes
// import ProductModel from './path-to-product-model';

export const likeProduct = async (req, res) => {

    //  console.log("Decoded user:", req.user); // Add this to check if req.user is available

    try {
        const productId = req.params.id;
        const userId = req.userId; // This should now be an ObjectId

        // console.log("__> " +req.userId)

        console.log(`Received request to like product with ID: ${productId} by user: ${userId}`);

        const product = await productSchemaModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has already liked the product
        console.log(userId)
        if (product.likedBy.includes(userId)) {
            return res.status(400).json({ message: "User has already liked this product" });
        }

        // Increment likes and add user to likedBy array
        product.likes += 1;
        product.likedBy.push(userId);
        await product.save();

        return res.status(200).json({ likes: product.likes });
    } catch (error) {
        console.error("Error liking product:", error);
        return res.status(500).json({ message: "An error occurred", error });
    }
};






