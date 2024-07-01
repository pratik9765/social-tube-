import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from '../utils/Cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async(req,res) => {
    // get user details
    const {fullName, userName, email, password} = req.body;

    // validation
    if([fullName, email, userName, password].some((field) => 
        field.trim() === ""
    )){
        throw new ApiError(400,"All fields are required");
    }

    // check if user already exist
    const existedUser = await User.findOne({
        $or : [{userName}, {email}]
    });

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    // check for images, avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    // upload images to clodinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    // create user object -> create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName : userName.toLowerCase(),
    })
    
    // remove password and refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    
    // return response
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


});


// const registerUser = async(req,res) => {
//     return res.status(200).json({
//         message:"ok",
//     })
// }

export {registerUser}