require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    const white_lists = [
        "/",
        "/register",
        "/login",
        "/forgot-password",
        "/forgot-password/verify",
        "/forgot-password/reset"
    ];
    const public_prefixes = ["/products", "/categories"];
    const isPublicExact = white_lists.find(
        item => '/v1/api' + item === req.originalUrl
    );
    const isPublicPrefix = public_prefixes.some(
        item => req.originalUrl.startsWith('/v1/api' + item)
    );

    if (isPublicExact || isPublicPrefix) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Fetch user from database to ensure we have the _id
                const user = await User.findOne({ email: decoded.email });
                if (!user) {
                    return res.status(401).json({
                        message: "User khong ton tai"
                    });
                }

                if (user.isLocked) {
                    return res.status(403).json({
                        message: "Tai khoan da bi khoa"
                    });
                }
                
                req.user = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    isAdmin: user.isAdmin,
                    createdBy: "hoidanit"
                }
                console.log(">>> check token and user: ", decoded, user)
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bi het han/hoac khong hop le"
                })
            }
        } else {
            return res.status(401).json({
                message: "Ban chua truyen Access Token o header/Hoac token bi het han"
            })
        }
    }
}

module.exports = auth;
