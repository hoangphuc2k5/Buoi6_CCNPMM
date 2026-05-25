require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const saltRounds = 10;
const OTP_TTL_MINUTES = 10;

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const getMailTransporter = () => {
    const port = Number(process.env.MAIL_PORT || 465);
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
}

const createUserService = async (name, email, password) => {
    try {
        //check user exist
        const user = await User.findOne({ email });
        if (user) {
            console.log(`>>> user exist, chon 1 email khac: ${email}`);
            return null;
        }

        //hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds)
        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User",
            isAdmin: false,
            isLocked: false
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async (email1, password) => {
    try {
        //fetch user by email
        const user = await User.findOne({ email: email1 });
        if (user) {
            if (user.isLocked) {
                return {
                    EC: 3,
                    EM: "Tai khoan da bi khoa"
                }
            }
            //compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password khong hop le"
                }
            } else {
                //create an access token
                const payload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin
                }

                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                return {
                    EC: 0,
                    access_token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                        isAdmin: user.isAdmin
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password khong hop le"
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserByIdService = async (userId) => {
    try {
        const user = await User.findById(userId).select("-password");
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateUserLockService = async (userId, isLocked) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { isLocked: !!isLocked },
            { new: true }
        ).select("-password");
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const forgotPasswordService = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                EC: 1,
                EM: "Email khong ton tai"
            };
        }
        const otp = generateOtp();
        const hashOtp = await bcrypt.hash(otp, saltRounds);
        user.otpCode = hashOtp;
        user.otpExpires = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
        await user.save();

        const transporter = getMailTransporter();
        const fromAddress = process.env.MAIL_FROM || process.env.MAIL_USER;

        await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: "Ma OTP khoi phuc mat khau",
            text: `Ma OTP cua ban la: ${otp}. Ma co hieu luc trong ${OTP_TTL_MINUTES} phut.`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Khoi phuc mat khau</h2>
                <p>Ma OTP cua ban la:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</div>
                <p>Ma co hieu luc trong ${OTP_TTL_MINUTES} phut.</p>
              </div>
            `
        });

        const response = {
            EC: 0,
            EM: "Da gui OTP, vui long kiem tra"
        };

        if (process.env.NODE_ENV !== "production") {
            response.DT = { otp };
        }

        return response;
    } catch (error) {
        console.log(error);
        return {
            EC: 2,
            EM: "Khong the gui OTP"
        };
    }
}

const verifyForgotPasswordOtpService = async (email, otp) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { EC: 1, EM: "Email khong ton tai" };
        }

        if (!user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
            return { EC: 2, EM: "OTP het han hoac khong ton tai" };
        }

        const isMatch = await bcrypt.compare(otp, user.otpCode);
        if (!isMatch) {
            return { EC: 3, EM: "OTP khong dung" };
        }

        return { EC: 0, EM: "OTP hop le" };
    } catch (error) {
        console.log(error);
        return { EC: 4, EM: "Co loi xay ra" };
    }
}

const resetPasswordService = async (email, otp, newPassword) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { EC: 1, EM: "Email khong ton tai" };
        }

        if (!user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
            return { EC: 2, EM: "OTP het han hoac khong ton tai" };
        }

        const isMatch = await bcrypt.compare(otp, user.otpCode);
        if (!isMatch) {
            return { EC: 3, EM: "OTP khong dung" };
        }

        const hashPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashPassword;
        user.otpCode = "";
        user.otpExpires = null;
        await user.save();

        return { EC: 0, EM: "Doi mat khau thanh cong" };
    } catch (error) {
        console.log(error);
        return { EC: 4, EM: "Co loi xay ra" };
    }
}

module.exports = {
    createUserService,
    loginService,
    getUserService,
    forgotPasswordService,
    verifyForgotPasswordOtpService,
    resetPasswordService,
    getUserByIdService,
    updateUserLockService
}
