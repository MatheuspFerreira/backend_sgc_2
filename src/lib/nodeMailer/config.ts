const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "mail.inspell.com.br",
    auth: {
      user: "matheus@inspell.com",
      pass: "imat4028"
    },
});

export default transporter;
