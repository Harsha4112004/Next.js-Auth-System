import nodemailer from 'nodemailer';
import User from '@/models/users.models';
import bcrypt from 'bcryptjs';

export const sendMail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedtoken = await bcrypt.hash(userId.toString(), 10)
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedtoken, verifyTokenExpiry: Date.now() + 3600000 })
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedtoken, forgotPasswordExpiry: Date.now() + 3600000 })
        }
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            }
        });
        const mailOptions = {
            from: "autobots.omega@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verify-email" : "reset-password"}?token=${hashedtoken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
        };
        const res = await transport.sendMail(mailOptions);
        return res;
    } catch (error) {
        console.log(error);
    }
}