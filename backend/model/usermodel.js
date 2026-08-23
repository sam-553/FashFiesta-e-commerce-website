import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    maxLength: [25, "Invalid name. Please enter a name with fewer than 25 characters"],
    minLength: [3, "Name should contain more than 3 characters"],
  },

  email: {
    type: String,
    required: [true, "Please Enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },

  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },

  avatar: {
    public_id: String,
    url: String,
  },

  role: {
    type: String,
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// 🔐 Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// 🔑 JWT token
userSchema.methods.getJWTToken = function () {
  return JWT.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// 🔑 Password compare (FIXED NAME)
userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// 🔑 Reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

export default mongoose.models.User || mongoose.model("User", userSchema);