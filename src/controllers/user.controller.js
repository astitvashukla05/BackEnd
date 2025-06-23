import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import ApiRes from "../utils/ApiRes.js";
import jwt from "jsonwebtoken";
//For register user first we will be getting all data from user
// We will check if all required fields are filled or not
// Then check if the username ,fullName is unique
//check if user already Exists
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
      (fields) => !fields || fields.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Checking a correct format of email
  if (!email.includes("@gmail.com")) {
    throw new ApiError(400, "Please enter a valid Email");
  }

  // Checking if the user already Exists
  const ifExists = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (ifExists) {
    throw new ApiError(409, "User already Exists");
  }

  // Uploading files to multer and Checking if we are getting valid data
  const avatarLocalPath = req.files.avatar[0].path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
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

  //Extracting all fields without pass and refreshTokens to check if it is saved or not

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

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};
const loginUser = asyncHandler(async (req, res) => {
  // reqBody ->data
  // username or email
  // check if user exists
  // checking password if wrong then redirect to login showing error
  // gen access token and refresh refreshTokens
  // Send cookie
  // RES -> login success

  const { email, password, username } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Username or Email required");
  }

  const user = await User.findOne({ $or: [{ userName: username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User do not exists");
  }
  const validation = await user.isPasswordCorrect(password);

  if (!validation) {
    throw new ApiError(400, "Please enter a correct password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRes(
        200,
        {
          user: user,
          accessToken,
          refreshToken,
        },
        "User looked in successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiRes(200,"User logged out ")
  )
});
const refreshAccessToken=asyncHandler(async(req,res)=>{
 const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
 if(!incomingRefreshToken){
  throw new ApiError(404,"Unauthorized request")
 }
 try {
  const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  const user=await User.findById(decodedToken._id)
   if(!user){
   throw new ApiError(404,"Invalid Token")
  }
  if(incomingRefreshToken !=user.refreshToken){
   throw new ApiError(404,"Refresh Token is expired")
  }
  const options={
   httpOnly:true,
   secure:true
  }
  const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
  res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
       new ApiRes(
         200,
         {
           user: user,
           accessToken,
           newRefreshToken,
         },
         "Access Token Refreshed"
       )
     )
 
 } catch (error) {
  throw new ApiError(400,"Invalid Refresh token")
  
 }
})
export { registerUser, loginUser, logoutUser,refreshAccessToken };
