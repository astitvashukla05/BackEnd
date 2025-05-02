import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import ApiRes from "../utils/ApiRes.js";

const registerUser = asyncHandler(async (req, res) => {
  // Getting data from user
  const { username, fullname, email, password } = req.body;

  // Checking if the user is sending empty data from frontend
  if (
    [username, fullname, email, password].some(
      (feilds) => !feilds || feilds.trim() === ""
    )
  ) {
    throw new ApiError(400, "All feilds are reuiqred");
  }

  // Cheching if the user already exsists
  const ifExists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (ifExists) {
    throw new ApiError(409, "User already Exsists");
  }

  // Uplaoding files to multer and Checking if we are getting valid data
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverimage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar Required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //Checking if uploaded data is ok
  if (!avatar) {
    throw new ApiError(409, "Avatar Required");
  }
  //Saving to DB
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    username,
    email,
    password,
    coverImage: coverImage ? coverImage.url : "",
    username: username.toLowerCase(),
  });
  //EXtracting all feilds without pass and refreshTokens to chekc if it is saved or not
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );
  if (!createUser) {
    throw new ApiError(500, "User Failed To Register");
  }
  // Returing Response
  return res
    .status(200)
    .json(new ApiRes(200, createUser, "User Registered success"));
 });
export default registerUser;
