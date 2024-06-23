require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_ID);

module.exports = resend;
