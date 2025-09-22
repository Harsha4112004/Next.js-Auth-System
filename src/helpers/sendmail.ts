import nodemailer from "nodemailer";
import User from "@/models/users.models";
import jwt from "jsonwebtoken";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a JWT token instead of bcrypt hash
    const token = jwt.sign(
      { id: userId },                  // payload
      process.env.TOKEN_SECRET!,       // secret from env
      { expiresIn: "1h" }              // token expiry
    );

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000, // optional
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordExpiry: Date.now() + 3600000, // optional
      });
    }

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const link = `${process.env.DOMAIN}/${
      emailType === "VERIFY" ? "verify-email" : "reset-password"
    }?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: "autobots.omega@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }</p>`,
    };

    const res = await transport.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.log(error);
  }
};
