
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Profile Photo
    profileImage: {
      type: String,
      default: "",
    },

    // Email Authentication
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
      default: undefined,
    },

    // Mobile Authentication
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      default: undefined,
    },

    password: {
      type: String,
      minlength: 6,
      default: undefined,
    },

    // Contact Verification
    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    // OTP Verification
    otpHash: {
      type: String,
      default: undefined,
    },

    otpExpiresAt: {
      type: Date,
      default: undefined,
    },

    otpPurpose: {
      type: String,
      enum: ["registration", "login", "email-change", "phone-change"],
      default: undefined,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpLastSentAt: {
      type: Date,
      default: undefined,
    },

    // Google Authentication
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "both"],
      default: "local",
    },
  },
  {
    timestamps: true,
  }
);

// At least one contact method or Google account is required
userSchema.pre("validate", function () {
  if (!this.email && !this.phone && !this.googleId) {
    this.invalidate(
      "email",
      "Email or mobile number is required."
    );
  }
});

const User = mongoose.model("User", userSchema);

export default User;
