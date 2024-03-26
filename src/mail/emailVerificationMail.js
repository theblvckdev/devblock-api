const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

const sendEmailVerificationMail = (options) => {
  const { email, subject, verificationURL, username } = options;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    logger: true,
    secure: false,
    debug: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    ignoreTLS: true,
  });

  const source = path.join(__dirname, '../views/emailVerification.handlebars');
  console.log(source);

  transporter.use(
    'compile',
    hbs({
      viewEngine: 'express-handlebars',
      viewPath: './src/views/',
    })
  );

  const mailOptions = {
    from: 'Lumo <support@lumo.com>',
    to: email,
    subject,
    template: 'emailVerification',
    context: { layout: source, email, verificationURL, username },
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log('ERROR 💣', err);
    else console.log(`Email sent successfully ${info}`);
  });
};

module.exports = sendEmailVerificationMail;
