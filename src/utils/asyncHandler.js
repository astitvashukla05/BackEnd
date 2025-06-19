<<<<<<< HEAD
export const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((next))
    }
}
export default asyncHandler
=======
const asyncHandler = (func) => {

  return async (req, res, next) => {

    try {
      await func(req, res, next);

    } 
    catch (err) {
      res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    }
  };
};
export default asyncHandler;

// export const asyncHandler=(func)=>{
//     return (req,res,next)=>{
//         Promise.resolve(func(req,res,next)).catch((error)=> next(error))
//     }
// }
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
