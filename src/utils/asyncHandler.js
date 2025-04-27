const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(err,req,res,next)).catch((err)=>next(err))
    }


}