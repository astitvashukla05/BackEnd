import  asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from '../utils/Cloudinary.js'; 
import ApiRes from "../utils/ApiRes.js";

//For register user first we will be getting all data from user
// We will check if all required feilds are filled or not
// Then check if the username ,fullName is unique
//check if user already exsists
// Then create the user in db and fetch its data
// If all things goes right send a Response

const registerUser = asyncHandler(async (req, res) => {

  // Getting data from user

  const { userName, fullName, email, password } = req.body;
  
 // console.log("Files received:", req.files);
 // console.log("Body received:", req.body);


  // Checking if the user is sending empty data from frontend
  if (
    [userName, fullName, email, password].some(
      (feilds) => !feilds || feilds.trim() === "")
  ) {
    throw new ApiError(400, "All feilds are required");
  }

  // Checking a correct format of email
  if(!email.includes('@gmail.com')){
    throw new ApiError(400,"Please enter a valid Email")
  }

  // Cheching if the user already exsists
  const ifExists = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (ifExists) {
    throw new ApiError(409, "User already Exsists");
  }

  // Uplaoding files to multer and Checking if we are getting valid data
  const avatarLocalPath =req.files.avatar[0].path;

  let coverImageLocalPath;

  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ){
     coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar Required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //console.log(avatar)

  //Checking if uploaded data is ok

  if (!avatar) {
    throw new ApiError(409, "Avatar Required");
  }

  //Saving to DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    coverImage: coverImage ? coverImage.url : "",
    userName: userName.toLowerCase(),
  });

  //Extracting all feilds without pass and refreshTokens to check if it is saved or not

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );
  if (!createdUser) {
    throw new ApiError(500, "User Failed To Register");
  }

  // Returing Response
  // res.send("Saved Your Data")
  
  return res
    .status(200)
    .json(new ApiRes(200, createdUser, "User Registered successfully"));
 });

export default registerUser;
