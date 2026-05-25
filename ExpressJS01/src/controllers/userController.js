const {
    createUserService,
    loginService,
    getUserService,
    forgotPasswordService,
    verifyForgotPasswordOtpService,
    resetPasswordService,
    getUserByIdService,
    updateUserLockService,
    updateProfileService
} = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data)
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);

    return res.status(200).json(data)
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data)
}

const getAccount = async (req, res) => {

    return res.status(200).json(req.user)
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;
        const data = await updateProfileService(userId, updateData);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: -1,
            EM: "Loi server",
            DT: ""
        });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const data = await forgotPasswordService(email);
    return res.status(200).json(data);
}

const verifyForgotPasswordOtp = async (req, res) => {
    const { email, otp } = req.body;
    const data = await verifyForgotPasswordOtpService(email, otp);
    return res.status(200).json(data);
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const data = await resetPasswordService(email, otp, newPassword);
    return res.status(200).json(data);
}

const getUserDetail = async (req, res) => {
    const { userId } = req.params;
    const data = await getUserByIdService(userId);
    if (!data) {
        return res.status(404).json({ message: "Khong tim thay user." });
    }
    return res.status(200).json(data);
}

const updateUserLock = async (req, res) => {
    const { userId } = req.params;
    const { isLocked } = req.body;
    const data = await updateUserLockService(userId, isLocked);
    if (!data) {
        return res.status(404).json({ message: "Khong tim thay user." });
    }
    return res.status(200).json(data);
}

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount,
    updateProfile,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    getUserDetail,
    updateUserLock
}
