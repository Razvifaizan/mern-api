import express from 'express'
const route = express.Router()



import * as productController from '../controller/ProductController.js'
import { verifyToken, verifyTokenuser } from '../middlewares/verifyToken.js';

route.post("/saveProduct",verifyToken,productController.saveProduct);
route.patch("/updateProduct",productController.updateProduct);
route.get("/viewAllProductDetailsList",verifyToken,productController.viewAllProductDetailsList);
route.post("/viewProduct",verifyToken,productController.viewProduct);
route.delete("/deleteProduct",productController.deleteProduct);
route.post('/addComment', productController.addComment);
// route.put('/product/:id/like', verifyToken, productController.likeProduct);
route.put('/:id/like', verifyToken, productController.likeProduct);

route.post('/viewComment', productController.viewComment);





export default route;