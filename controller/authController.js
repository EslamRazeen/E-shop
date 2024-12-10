// const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandelr = require("express-async-handler");
const UserSchema = require("../models/schemaUser");
const ApiError = require("../utils/apiError");
// const sendEmail = require("../utils/sendEmail");

const signup = asyncHandelr(async (req, res, next) => {
  // Create user
  const user = await UserSchema.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // Generate token
  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPITRE,
  });

  res.status(201).json({ data: user, token });
});

const login = asyncHandelr(async (req, res, next) => {
  const user = await UserSchema.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new Error("Incorrect email or password");
  }

  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPITRE,
  });

  res.status(200).json({ data: user, token });
});

// Authentication
const protect = asyncHandelr(async (req, res, next) => {
  //1 Check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to get access this route",
        401
      )
    );
  }

  //2 Verify token (no change happened, expired token)
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // console.log("Decoded Token: ", decode);

  //3 Check if user exists
  const cuerrentUser = await UserSchema.findById(decode.userID);
  if (!cuerrentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  //4 Check if user change his password after token created
  if (cuerrentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      cuerrentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(passChangedTimestamp, decode.iat);

    if (passChangedTimestamp > decode.iat) {
      return next(
        new ApiError(
          "This user changed his password recently, please login again.."
        ),
        401
      );
    }
  }

  req.user = cuerrentUser;
  next();
});

//Authorization
const allowedTo = (
  ...roles // ...roles ==> ["admin", "manager"]
) =>
  asyncHandelr(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You are not allowed to access this route"));
    }
    next();
  });

/////////////////////////////////////
const demoforgotPassword =
  "This section is locked because google policies about less secure app";
// const forgotPassword = asyncHandelr(async (req, res, next) => {
//   // 1) Get user by email
//   const user = await UserSchema.findOne({ email: req.body.email });
//   if (!user) {
//     return next(
//       new ApiError(`There is no user with this email: ${req.body.email}`, 404)
//     );
//   }
//   // 2) Generate hash reset 6 random digits and save it in DB
//   const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
//   const hashedCode = crypto // Crypto is a built-in in nodeJS
//     .createHash("sha256")
//     .update(resetCode)
//     .digest("hex");

//   user.passwordResetCode = hashedCode;
//   user.passwordExpiredCode = Date.now() + 10 * 60 * 1000;
//   user.passwordVerifiedCode = false;

//   await user.save();
//   console.log(user);
//   next();

// 3) Send the reset code via email
// try {
//   await sendEmail({
//     email: user.email,
//     subject: "Your Password reset code (verified for 10 minutes)",
//     message: `Hi ${user.name} \n\n We received a request to reset the password on your E-shop account. \n${resetCode}
//   \n Enter this code to complete the reset. \n\n Thanks, E-shop Team`,
//   });
// } catch (err) {
//   user.passwordResetCode = undefined;
//   user.passwordExpiredCode = undefined;
//   user.passwordVerifiedCode = undefined;

//   await user.save();
//   return next(new ApiError(`There is an error in sending email`, 500));
// }

// res
//   .status(200)
//   .json({ status: "Success", message: "Reset code sent to email" });

////////////////
//with sendGrid

// const transporter = nodeMailer.createTransport({
//   host: "smtp.sendgrid.net",
//   port: 465, // Use 465 for SSL (secure connection)
//   secure: true,
//   auth: {
//     user: "apikey", // SendGrid requires 'apikey' as the username
//     pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
//   },
// });

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: "rozza8742@gmail.com", // Change to your recipient
//   from: "'E-shop App' <u48355019.wl020.sendgrid.net>", // Change to your verified sender
//   subject: "Sending with SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

// transporter.sendMail(msg, (error, info) => {
//   if (error) {
//     console.error("Error sending email:", error);
//     return;
//   }
//   console.log("Email sent successfully:", info.response);
// });
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log("Email sent");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

////////////////

// });

module.exports = {
  signup,
  login,
  protect,
  allowedTo,
  // forgotPassword,
};
