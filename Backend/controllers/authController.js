
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import sendOTPEmail from "../utils/sendOTPEmail.js";
import { generateOTP, hashOTP } from "../utils/otpUtils.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Prepare user response
const getUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email || null,
  phone: user.phone || null,
  profileImage: user.profileImage || "",
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
});

// 1. REGISTER USER AND SEND EMAIL OTP
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({
        message: "Name, password and email or mobile number are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    // Mobile OTP will be connected after SMS provider setup
    if (!email && phone) {
      return res.status(501).json({
        message: "Mobile OTP registration is not configured yet. Please register using email for now.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not overwrite an existing account
    if (user && user.otpPurpose !== "registration") {
      return res.status(409).json({
        message: "Email is already registered. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();

    if (!user) {
      user = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });
    } else {
      // Refresh an existing pending registration
      user.name = name.trim();
      user.password = hashedPassword;
    }

    user.emailVerified = false;
    user.otpHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otpPurpose = "registration";
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date();

    await user.save();

    try {
      await sendOTPEmail(user.email, otp, user.name);
    } catch (emailError) {
      console.error("OTP email error:", emailError);

      user.otpHash = undefined;
      user.otpExpiresAt = undefined;
      user.otpPurpose = undefined;
      user.otpAttempts = 0;
      user.otpLastSentAt = undefined;

      await user.save();

      return res.status(500).json({
        message: "Unable to send OTP email. Please try again.",
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully. Please verify your email.",
      email: user.email,
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Unable to register user.",
    });
  }
};

// 2. VERIFY EMAIL OTP
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      otpPurpose: "registration",
    });

    if (!user || !user.otpHash) {
      return res.status(400).json({
        message: "No pending email verification found.",
      });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    const submittedHash = hashOTP(String(otp).trim());

    const isValid =
      submittedHash.length === user.otpHash.length &&
      crypto.timingSafeEqual(
        Buffer.from(submittedHash, "hex"),
        Buffer.from(user.otpHash, "hex")
      );

    if (!isValid) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
        remainingAttempts: Math.max(0, 5 - user.otpAttempts),
      });
    }

    user.emailVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpPurpose = undefined;
    user.otpAttempts = 0;
    user.otpLastSentAt = undefined;

    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Email verified and registration successful.",
      token,
      user: getUserResponse(user),
    });

  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      message: "Unable to verify OTP.",
    });
  }
};

// 3. RESEND EMAIL OTP
export const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      otpPurpose: "registration",
    });

    if (!user || user.emailVerified) {
      return res.status(404).json({
        message: "No pending registration found for this email.",
      });
    }

    // 60-second resend cooldown
    if (
      user.otpLastSentAt &&
      Date.now() - user.otpLastSentAt.getTime() < 60000
    ) {
      return res.status(429).json({
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    const otp = generateOTP();

    user.otpHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date();

    await user.save();

    try {
      await sendOTPEmail(user.email, otp, user.name);
    } catch (emailError) {
      console.error("Resend OTP email error:", emailError);

      return res.status(500).json({
        message: "Unable to resend OTP email.",
      });
    }

    return res.status(200).json({
      message: "A new OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      message: "Unable to resend OTP.",
    });
  }
};

// 4. LOGIN USER USING EMAIL OR MOBILE
export const loginUser = async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;

    const loginIdentifier = (identifier || email || phone || "").trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        message: "Email or mobile number and password are required.",
      });
    }

    const isEmail = loginIdentifier.includes("@");

    const user = await User.findOne(
      isEmail
        ? { email: loginIdentifier.toLowerCase() }
        : { phone: loginIdentifier }
    );

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email/mobile number or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email/mobile number or password.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: getUserResponse(user),
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to login.",
    });
  }
};

// 5. GOOGLE SIGN-IN AND SIGN-UP
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        message: "Google authentication is not configured.",
      });
    }

    const googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID
    );

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        message: "Google email could not be verified.",
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0];

    // Find existing Google account
    let user = await User.findOne({ googleId });

    // Find existing account using verified email
    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        if (user.googleId && user.googleId !== googleId) {
          return res.status(409).json({
            message: "This email is linked to another Google account.",
          });
        }

        // Link Google account to existing account
        user.googleId = googleId;
        user.emailVerified = true;
        user.authProvider = user.password ? "both" : "google";

        // Clear any pending registration OTP
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpPurpose = undefined;
        user.otpAttempts = 0;
        user.otpLastSentAt = undefined;

        await user.save();
      }
    }

    // Create new Google account
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        emailVerified: true,
        authProvider: "google",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Google authentication successful.",
      token,
      user: getUserResponse(user),
    });

  } catch (error) {
    console.error("Google authentication error:", error);

    return res.status(401).json({
      message: "Google Sign-In failed. Please try again.",
    });
  }
};
