
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        throw new Error(
            "EMAIL_USER or EMAIL_PASS is missing in Backend .env file."
        );
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    return await transporter.sendMail({
        from: `"Book Basket" <${emailUser}>`,
        to,
        subject,
        text,
        html,
    });
};

export default sendEmail;
