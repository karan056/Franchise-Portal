var {getUserModel}=require("../models/userModel");
var path=require("path");
var jwt=require("jsonwebtoken");

var UserColRef=getUserModel();
const {getSalesModel} = require("../models/SalesModel"); // Import SalesData model
var SalesData = getSalesModel(); // Get SalesData collection reference
const submitSalesData = async (req, res) => {
  try {
    const { useremail, date, customers, todaySale } = req.body;

    // Validate required fields
    if (!useremail || !date || !customers || !todaySale) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Create new sales record
    const newSale = new SalesData({
      useremail,
      date,
      customers,
      todaySale,
    });

    await newSale.save(); // Save data to MongoDB

    res.status(201).json({ success: true, message: "Sales data saved successfully!" });
  } catch (error) {
    console.error("Error saving sales data:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getSalesData = async (req, res) => {
  try {
    const { useremail } = req.query;
    
    if (!useremail) {
      return res.status(400).json({ success: false, message: "User email is required." });
    }

    const sales = await SalesData.find({ useremail }).sort({ date: -1 });
    
    res.status(200).json({ 
      success: true, 
      data: sales,
      message: "Sales data fetched successfully!"
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


function doSaveUserWithPost(req,resp)
{
        console.log(req.body);
        //req.body.picpath=req.body.ppic;
        req.body.status=0;
        var userObj=new UserColRef(req.body);
        userObj.save().then((document)=>{
                //resp.send(document)
                resp.json({doc:document,status:true,msg:"Saved Successfully with post"});

        }).catch((err)=>{
                console.log(err.message);
                //resp.send(err.message)
                resp.json({status:false,msg:err.message});

        })
}

// function doSaveUserWithPic(req,resp)
// {

//     let filename="nopic.jpg";
//     if(req.files!=null)
//     {
//         filename=req.files.ppic.name;

//         var filepath=path.join(__dirname,"..","uploads",filename);
//         req.files.ppic.mv(filepath);
//         console.log(filepath)
//     }
//     else
//     console.log(req.files);


//     req.body.picpath=filename; //adding a n ew field in body object



//     //==========================================
//     var userJson=new UserColRef(req.body);

//     userJson.save().then((document)=>{

//         let jtoken=jwt.sign({uid:req.body.uid},process.env.SEC_KEY,{expiresIn:"1m"});

//         resp.json({doc:document,status:true,msg:"Saved Successfully with pic",token:jtoken});
//     }).catch((err)=>{
//         resp.json({status:false,msg:err.message});
//     })
// }

// function doShowAll(req,resp)
// {
//     UserColRef.find().then((document)=>{
//             resp.send(document)
//     }).catch((err)=>{
//             console.log(err.message);
//             resp.send(err.message)
//     })
// }

// function validateTokenn(req,resp)
// {
//         console.log("********")
       
//        const full_token = req.headers['authorization'];//keyword
//         console.log(full_token);
    
//         var ary=full_token.split(" ");
//         let actualToken=ary[1];
//         let isTokenValid;
        
    
//         try{
//             isTokenValid= jwt.verify(actualToken,process.env.SEC_KEY);
//             console.log(isTokenValid);
//             if(isTokenValid!=null)
//             {
//                 const payload = jwt.decode(ary[1]);
//                 console.log(payload);

//                 resp.json({status:true,msg:"**Aauthorized",item:payload});
//             }
//             else
//             resp.json({status:false,msg:"**SORRRRYYY"});
            
            
//         }
//         catch(err)
//         {
//             resp.json({status:false,msg:err.message});
//             return;
//         }
            
// }
// async function doDelete(req,resp) {
//         UserColRef.deleteOne({ uid: req.body.uid }).then((msg) => {
//                 if(msg.deletedCount==1)
//                 resp.json({status: true, message: "Deleted "})
//         else
//                 resp.json({status: true, message: "Invalid ID "})
//             }).catch((err) => {
//                 resp.send(err.message);
//             })
// }
 module.exports={doSaveUserWithPost, submitSalesData, getSalesData}
