const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create transporter (service that will secn email like "gmail", "mailgun", "mailtrap", "sendGrid")
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // port =465 if secure = true, 587 if secure = false
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define email options like(from, to, subject, email content)
  const mailOptions = {
    from: "E-shop App <progrozza8742@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
