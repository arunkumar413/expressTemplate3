var nodemailer = require("nodemailer");

module.exports.sendEmailVerification = async function (
  name,
  toEmailId,
  verificationCode
) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "youremail@gmail.com",
      pass: "yourpassword",
    },
  });

  var mailOptions = {
    from: "youremail@gmail.com",
    to: toEmailId,
    subject: "verify your account",
    text: `Hi There,
     
    Thanks for registering account with us. 

    Your verification code is ${verificationCode}

    Please visit the link to verify your account

    Regards,
    ExpressAppTeam

    This is a system generated email. Please do not reply.
    
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
