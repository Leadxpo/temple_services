const fs = require("fs")
const {errorResponse,successResponse} = require("./response")
const path = require("path")


const deleteImage = async(ImagePath)=>{
    fs.unlink(`./storege/userdp/${ImagePath}`, (error)=>{
        if (error)
         {
            errorResponse(error)
        }
         else 
        {
           console.log("sucessfuly deleted") 
           successResponse("sucess")
        }
    })
}


module.exports={
    deleteImage
}