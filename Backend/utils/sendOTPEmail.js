import sendEmail from "./sendEmail.js";

const sendOTPEmail = async (email, otp, name) => {
    await sendEmail({
        to: email,
        subject: "Book Basket - Email Verification OTP",

        text: `Hello ${name},

Your Book Basket verification OTP is: ${otp}

This OTP is valid for 5 minutes.
Do not share this OTP with anyone.

Regards,
Book Basket Team`,

        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Book Basket!</h2>
        <p>Hello ${name},</p>
        <p>Your email verification OTP is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>
        <p>Book Basket Team</p>
      </div>
    `,
    });
};

export default sendOTPEmail;