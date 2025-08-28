var express=require("express");

var obj=require("../controllers/adminController");

var router=express.Router();

router.get("/getApplicants",obj.doShowAll);
router.put("/updateStatus/:id", obj.updateStatus);
router.get("/showApplicant/:email", obj.showApplicant); 
router.post("/createFranchise", obj.createFranchise); 
router.post("/login", obj.loginUser);

module.exports = router;