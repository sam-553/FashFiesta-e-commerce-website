// --- utils/sendToken.js ---
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const cookieExpireDays = Number(process.env.EXPIRE_COOKIE) || 7; // default to 7 days

    const options = {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'Strict', // or 'Lax' if needed for frontend behavior
    };

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
           success: true,
           user,
           // token, // optional: remove if using cookie-only auth
       });
};

export default sendToken;
