const resend = require('../config/resend');
const jwtUtils = require('../utils/jwtUtils');

const sendVerificationEmail = async (user) => {
    const token = jwtUtils.generateToken({ id: user.id, email: user.email }, '1h'); // Token有效期1小时
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;

    const emailBody = `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationLink}">Verify Email</a>
  `;

    await resend.emails.send({
        from: 'service@chunkgo.com',
        to: user.email,
        subject: 'Email Verification',
        html: emailBody
    });
};

module.exports = { sendVerificationEmail };
