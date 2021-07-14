const nodemailer = require("nodemailer");
const { MAILER_USER, MAILER_PWD, SMTP_PORT } = require('../config')

module.exports.emailer = (data) => {
  const { email, subject, htmlData } = data
  // console.log({ email, subject, htmlData });
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'webinarsfyp@gmail.com', //MAILER_USER,
        pass: 'abc123#$', // MAILER_PWD
      }
    });

    const options = {
      from: "Webinars Online",
      to: `${email}`,
      subject: subject,
      html: htmlData
    }
    transporter.sendMail(options, (err, info) => {
      if (!err) {
        console.log(`email sent to ${email}`)
        
       // console.log(info);
        resolve(info);
      }
      else {
        console.log(`email not sent to ${email}`, err)
      reject(err)
      }
    });
  })
}