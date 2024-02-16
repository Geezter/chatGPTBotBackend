import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL_ADDRESS, // Your Gmail email address
    pass: process.env.NODEMAILER_EMAIL_PASSWORD, // Your Gmail email password or an app-specific password
  },
});

export default transporter;