var express=require("express"); 
var obj=require("../controllers/userController"); 
//const { validateTokenn2 } = require("../config/validate"); 
 
var userRouter=express.Router(); 
 
//userRouter.get("/saveuser",obj.doSaveUserWithGet); 
userRouter.post("/saveuserWithPost",obj.doSaveUserWithPost); 
// userRouter.post("/saveuserWithPic",obj.doSaveUserWithPic); 
// userRouter.get("/validatetokenn",obj.validateTokenn); 
// userRouter.post("/doDelete",validateTokenn2,obj.doDelete); 
userRouter.post("/submitsales", obj.submitSalesData);
userRouter.get("/getsales", obj.getSalesData);

module.exports=userRouter;