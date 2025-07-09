import Model from '../model/usermodel.js';
import handleasyncError from '../middlewear/handleasyncError.js';
import sendToken from '../utils/jwtToken.js';
 // Ensure this file exists and exports correctly
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import cloudinaryModule from 'cloudinary';
import bcrypt from 'bcryptjs';
import handleError from '../utils/handleError.js';

const cloudinary = cloudinaryModule.v2;


// Register User
const userRegister = handleasyncError(async (req, res, next) => {
  const { name, password, email, avatar } = req.body;

  if (!name || !email || !password || !avatar) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await Model.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists." });
  }

  // Upload to Cloudinary
  const mycloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 300,
    crop: "scale"
  });

  const user = await Model.create({
    name,
    email,
    password, // ensure User model hashes it automatically
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url
    }
  });

  return sendToken(user, 201, res);
});

// Login User
const loginUser = handleasyncError(async (req, res, next) => {
  const { email, password } = req.body;
  

  if (!email || !password) {
    return next(new HandleError("Email or password cannot be empty", 400));
  }

  const user = await Model.findOne({ email }).select("+password");

  if (!user) {
    return next(new HandleError("Invalid Email or password", 401));
  }

  // You should also compare passwords here with bcrypt (not shown)
  const isPasswordMatched = await bcrypt.compare(password, user.password);
if (!isPasswordMatched) {
    return next(new HandleError("Invalid Email or password", 401));
}


  return sendToken(user, 200, res);
});

// Logout User
const logOut = handleasyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "Successfully Logged Out"
  });
});

// Reset Password
const requestresetpassword = handleasyncError(async (req, res, next) => {
    const { email } = req.body;

    const user = await Model.findOne({ email });
    if (!user) {
        return next(new handleError("User doesn't exist", 404));
    }

    try {
        const resetToken = user.generatepasswordResetToken();
        console.log("Reset Token (raw):", resetToken);
        console.log("Reset Token (hashed):", user.resetPasswordToken);

        await user.save({ validateBeforeSave: false });

        const resetPasswordURL = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
        console.log("Reset URL:", resetPasswordURL);

        const message = `You requested a password reset. Please click the link below to reset your password:\n\n${resetPasswordURL}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully.`,
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new handleError("Email couldn't be sent, please try again later.", 500));
        }
    } catch (error) {
        console.error(error);
        return next(new handleError("Could not save reset token, please try again later", 500));
    }
});

// ✅ Reset Password Controller
const resetPassword = handleasyncError(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await Model.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new handleError("Reset Password token is invalid or has expired", 400));
    }

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new handleError("Both password and confirmPassword are required", 400));
    }

    if (password !== confirmPassword) {
        return next(new handleError("Passwords do not match", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});
//reset password


// getting userdetails
const getUserDetails=handleasyncError(async(req , res , next)=>{
    const user=await Model.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
 
    
})
//update password
const updatePassword = handleasyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await Model.findById(req.user.id).select('+password');
    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) {
        return next(new HandleError("Old password is incorrect", 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new HandleError("New passwords do not match", 400));
    }

    if (newPassword.length < 8) {
        return next(new HandleError("Password must be at least 8 characters long", 400));
    }

   user.password = newPassword;

    await user.save();

    // Optionally re-login the user after password change:
    sendToken(user, 200, res);
});


//update profile
const updateProfile = handleasyncError(async (req, res, next) => {
  const { name, email, avatar } = req.body; // Add avatar

  const updateUserDetails = { name, email };

  if (avatar) {
    // Upload to Cloudinary
    const mycloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 300,
      crop: "scale",
    });
    updateUserDetails.avatar = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  }

  const user = await Model.findByIdAndUpdate(req.user.id, updateUserDetails, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});


const getUsersList = handleasyncError(async (req, res, next) => {
    const users = await Model.find();
    res.status(200).json({
        success: true,
        users
    });
});
//Admin- Getting single user information
 const getSingleUser = handleasyncError(async (req, res, next) => {
    const { id } = req.params;

    // Validate ObjectId to prevent CastError
    
    // Ensure correct model usage
    const user = await Model.findById(id);
    if (!user) {
        return next(new HandleError(`User doesn't exist with this id: ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});

//Admin- Changing user role
 const updateUserRole=handleasyncError(async(req,res,next)=>{
    const {role}=req.body;
    const newUserData={
        role
    }
    const user=await Model.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true
    })
    if(!user){
        return next(new HandleError("User doesn't exist",400))
    }
    res.status(200).json({
        success: true,
        user
    })

    
})
// Admin - Delete User Profile
 const deleteUser = handleasyncError(async (req, res, next) => {
    const userId = req.params.id;
    const user = await Model.findById(userId);

    if (!user) {
        return next(new HandleError("User doesn't exist", 404));
    }
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});
export {
  userRegister,
  loginUser,
  logOut,
  requestresetpassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getUsersList,
  getSingleUser,
  updateUserRole,
  deleteUser
};
