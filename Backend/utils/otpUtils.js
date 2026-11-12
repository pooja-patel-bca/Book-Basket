import crypto from "crypto";

// Generate a random 6-digit OTP
export const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// Securely hash the OTP
export const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp + process.env.JWT_SECRET)
        .digest("hex");
};