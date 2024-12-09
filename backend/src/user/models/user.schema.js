import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is requires"],
    maxLength: [30, "user name can't exceed 30 characters"],
    minLength: [2, "name should have atleast 2 charcters"],
  },
  email: {
    type: String,
    required: [true, "user email is requires"],
    unique: [true, "A user with this email Id already exists"],
    validate: [validator.isEmail, "pls enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  profileImg: {
    public_id: {
      type: String,
      required: true,
      default: "1234567890",
    },
    url: {
      type: String,
      required: true,
      default: "this is dummy avatar url",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  passwordHashed: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  //  hash user password before saving using bcrypt
  if (!this.passwordHashed) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordHashed = true;
  }
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_Secret, {
    expiresIn: process.env.JWT_Expire,
  });
};
// user password compare
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generatePasswordResetToken
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(`resetToken: ${resetToken}`);

  // hashing and updating user resetPasswordToken
  console.log(crypto.createHash("sha256"));
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(`resetPasswordToken: ${this.resetPasswordToken}`);
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  console.log(`resetPasswordExpire: ${this.resetPasswordExpire}`);
  await this.save();
  console.log(this);
  return resetToken;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
