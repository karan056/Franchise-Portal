import React, { useState } from "react"; 
import axios from 'axios';
 

function Form () { 
  const [darkMode, setDarkMode] = useState(false); 
 
  const inputFieldStyles = "w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 text-gray-900 bg-gray-200 border-gray-300 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:focus:ring-indigo-400"; 
  const [obj,setObj]=useState({ 
    mname:"", 
    email:"", 
    mb:"", 
    addr:"", 
    bname:"", 
    site:"", 
    area:"", 
    floor:"", 
    city:"", 
    state:"", 
    pincode:"", 
    ownstatus:"", 
     
}) 
function doUpdate(event) 
{ 
  var {name,value}=event.target 
  setObj({...obj,[name]:value}) 
   
} 
async function dosave() 
{ 
  let url="http://localhost:2004/user/saveuserWithPost"; 
  let resp= await axios.post(url,obj,{headers: {'Content-Type': 'application/x-www-form-urlencoded'  } }); 
  alert(JSON.stringify(resp.data));
    // alert("hahaha");  
    if(resp.data.status==true) 
        alert(resp.data.msg); 
    else 
    { 
      alert(resp.data.msg); 
    } 
} 
  return ( 
    <div 
      className={`flex flex-col justify-center items-center w-full min-h-screen px-5 transition-colors duration-500 ${ 
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900" 
      }`} 
    > 
      <div className="absolute top-5 right-5"> 
        <div className="flex items-center"> 
          <h3 className="mr-2 text-sm font-medium">Dark Mode :</h3> 
          <label htmlFor="darkModeToggle" className="inline-flex items-center cursor-pointer"> 
            <input 
              id="darkModeToggle" 
              type="checkbox" 
              className="sr-only peer" 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)} 
            /> 
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 relative transition-colors"> 
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform peer-checked:translate-x-5"></div> 
            </div> 
          </label> 
        </div> 
      </div> 
 
      <div className={`flex flex-col justify-center items-center w-full max-w-lg p-8 sm:p-10 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} transition-all`}> 
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Franchise Application 2025</h1> 
 
        <form className="w-full space-y-4"> 
          <h2 className="text-xl font-semibold text-orange-600">Personal Information</h2> 
          <input type="text" name="mname" onChange={doUpdate} placeholder="Enter your Name" className={inputFieldStyles} /> 
          <div className="flex gap-4"> 
            <input type="email" name="email" onChange={doUpdate} placeholder="Enter your Email" className={`${inputFieldStyles} w-1/2`} /> 
            <input type="tel" name="mb" onChange={doUpdate} placeholder="Enter your Mobile Number" className={`${inputFieldStyles} w-1/2`} /> 
          </div> 
          <input type="text"name="addr" onChange={doUpdate} placeholder="Enter your Residential Address" className={inputFieldStyles} /> 
 
          <hr className="my-4" /> 
          <h2 className="text-xl font-semibold text-orange-600">Current Business Information (if any)</h2> 
          <input type="text" name="bname" onChange={doUpdate} placeholder="Business Name" className={inputFieldStyles} /> 
          <input type="text" name="site" onChange={doUpdate} placeholder="Site Location" className={inputFieldStyles} /> 
          <div className="flex gap-4"> 
            <input type="text" name="area" placeholder="Area (sq. feet) & Dimensions"  onChange={doUpdate} className={`${inputFieldStyles} w-1/2`} /> 
            <input type="text" name="floor" placeholder="Floor" onChange={doUpdate} className={`${inputFieldStyles} w-1/2`} /> 
          </div> 
          <div className="flex gap-4"> 
            <input type="text" name="city" placeholder="City" onChange={doUpdate} className={`${inputFieldStyles} w-1/3`} /> 
            <input type="text" name="state" placeholder="State" onChange={doUpdate} className={`${inputFieldStyles} w-1/3`} /> 
            <input type="text" name="pincode" placeholder="Pin Code" onChange={doUpdate} className={`${inputFieldStyles} w-1/3`} /> 
          </div> 
           
          <div className="mt-4"> 
            <h3 className="text-lg font-medium">Ownership Status:</h3> 
            <div className="flex gap-4 items-center"> 
              <label className="flex items-center"> 
                <input type="radio" name="ownstatus" value="Owned" className="mr-2" onChange={doUpdate} /> Owned 
              </label> 
              <label className="flex items-center"> 
                <input type="radio" name="ownstatus" value="Rented" className="mr-2" onChange={doUpdate} /> Rented 
              </label> 
            </div> 
          </div> 
           
          <input type="button" value={"Submit application"} className="w-full py-3 mt-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 transition duration-300" onClick={dosave}/>  
        </form> 
        {/* {JSON.stringify(obj)} */}
        <p className="mt-4 text-sm text-center">Terms and Conditions Applied.</p> 
      </div> 
    </div> 
  ); 
}; 
 
export default Form;