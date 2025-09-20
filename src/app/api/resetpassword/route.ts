import User from "@/models/users.models";
import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/db/dbConfig";
import bcrypt from "bcryptjs";

connect();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token , password} = reqBody;
        if (!token) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }
        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordExpiry: { $gt: Date.now() } });
        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
            return NextResponse.json({ message: "New password cannot be same as old password" }, { status: 401 });
        }
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save();
        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
}catch (error:any) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}