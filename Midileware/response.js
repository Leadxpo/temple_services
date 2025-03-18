const successResponse=(data)=>({
    
    data: data,
    error: null,
    success:true
})
const errorResponse=(data)=>({
error: data,
message: "User not found",
success:false

})

module.exports=
{
successResponse,
errorResponse
}