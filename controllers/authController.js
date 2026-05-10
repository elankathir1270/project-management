const authService = require('../services/auth.service');
const catchAsync = require('../utilities/catchAsync');

const cookieOptions = {
    httpOnly: true,
    sameSite: 'Strict'
}

if(process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
}

//Register
exports.register = catchAsync(async (req,res) => {
    console.log("REQ BODY:", req.body); 
    const {user,accessToken,refreshToken} = await authService.registerUser(req.body);

    //set refreshToken in cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(201).json({
        status: "success",
        token: accessToken,
        data: user
    });
});

//Login
exports.login = catchAsync(async (req,res) => {
    const {user,accessToken,refreshToken} = await authService.loginUser(req.body);

    //set refreshToken in cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
        status: "success",
        token: accessToken,
        data: user
    });
});

//Logout
exports.logout = catchAsync(async (req,res) => {
    res.clearCookie('refreshToken');

    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
});