const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text, html) {

    const auth = {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    };

    const setingTrans = {
        host: process.env.HOST_MAIL,
        port: parseInt(process.envPORT_MAIL),
        secure: false,
        auth
    };

    const transporter = nodemailer.createTransport(setingTrans);
    const data = { from: `Active Online Courses: <${process.env.EMAIL_USER}>`, to, subject, text, html };
    const info = await transporter.sendMail(data);

    return info;
}

module.exports = sendEmail;