import User from "../Models/Users";
import { Response } from "express";
import bcrypt from "bcryptjs";
import { sendOTP } from "../Mailing/OTPMail";
import { sendForgotEmail } from "../Mailing/forgotPasswordMail";
import { sendWelcomeEmail } from "../Mailing/welcomeMail";
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const userCache = new NodeCache();
const otpCache = new NodeCache();

interface Auth {
  signup: any;
  login: any;
  verifyOTP: any;
  resendOTP: any;
  forgotPassword: any;
  resetPassword: any;
}

const Auth: Auth = {
  signup: async (req: Request | any, res: Response) => {
    try {
      let { fullname, email, password, country, is_google } = req.body;
      console.log(req.body);
      if (
        !fullname ||
        !email ||
        !country
      ) {
        return res.status(400).json({ error: "Bad request." });
      } else {
        if (is_google != true && is_google != false) {
          return res.status(400).json({ error: "Bad request." });
        }

        if (is_google == false && !password) {
          return res.status(400).json({ error: "Bad request." });
        }

        if (is_google == true) {
          password = "";
        }

        let emailExists = await User.findOne({ where: { email: email } });

        if (!emailExists) {
          let preUser = req.body;
          preUser.role = "user";
          userCache.set(`user:${email}`, preUser);

          const otp = Math.floor(1000 + Math.random() * 9000);
          otpCache.set(`otp:${email}`, otp);
          sendOTP(email, fullname, otp);
          return res
            .status(200)
            .json({ success: true, message: "Proceed to enter OTP." });
        } else {
          return res.status(422).json({ error: "Email already exists." });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Error." });
    }
  },

  verifyOTP: async (req: Request | any, res: Response) => {
    try {
      const { otp, email } = req.body;

      if (!otp || !email) {
        return res.status(400).json({ error: "Bad request." });
      } else {
        if (otp != otpCache.get(`otp:${email}`)) {
          return res.status(409).json({
            message: "Incorrect OTP.",
            code: "INVALID_OTP_ENTERED",
          });
        } else {
          let userInfo = userCache.get(`user:${email}`);
          if (userInfo.role == "user") {
            let { fullname, email, password, country, is_google } = userInfo;
            const SALT_ROUNDS = process.env.SALT_ROUNDS as unknown as string;
            const saltRounds: number = parseInt(SALT_ROUNDS || "10", 10);
            const enc = await bcrypt.hash(password, saltRounds);


            if(is_google == true){
              password = '';
            }

            User.create({
              name: fullname,
              email: email,
              password: enc,
              country: country,
              last_active_date: new Date().toISOString().split("T")[0],
              by_google: is_google
            }).then((user) => {
              if (user) {
                const { password, ...userRef } = user.dataValues;
                const token = jwt.sign(userRef, process.env.SECRET_KEY, {
                  expiresIn: "24h",
                });

                sendWelcomeEmail(email, fullname);
                return res.status(201).json({
                  message: "Success",
                  code: "SIGNUP_COMPLETE",
                  details: "Signup completed.",
                  token: token,
                  user: userRef,
                });
              } else {
                return res.status(500).json({
                  message: "Connection error.",
                  code: "CONNECTION_ERR",
                  details: "Error connecting to database.",
                });
              }
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error." });
    }
  },

  resendOTP: async (req: Request | any, res: Response) => {
    try {
      let { email } = req.body;

      let { email_, name } = userCache.get(`user:${email}`);
      if (!userCache.get(`user:${email_}`)) {
        return res.status(404).json({ error: "No login process found." });
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      otpCache.set(`otp:${email_}`, otp);

      sendOTP(email_, name, otp);
      return res
        .status(200)
        .json({ sucess: true, message: "OTP sent sucessfully." });
    } catch (error) {
      return res.status(500).json({ error: "Server error." });
    }
  },

  login: async (req: Request | any, res: Response) => {
    try {
      let { email, password, is_google } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Bad request." });
      } else {
        if (is_google != true && is_google != false) {
          return res.status(400).json({ error: "Bad request." });
        }

        if (is_google == false && !password) {
          return res.status(400).json({ error: "Bad request." });
        }

        if (is_google == true) {
          password = "";
        }

        let user = await User.findOne({ where: { email: email } });

        if (!user) {
          return res.status(404).json({ error: "Invalid credentials. 😥" });
        } else {
          const match =
            is_google == true
              ? true
              : await bcrypt.compare(password, user.password);

          if(user.by_google && !is_google){
            return res.status(401).json({error: 'Login with google auth. `'});
          }

          if (match) {
            const { password, createdAt, updatedAt, ...userRef } =
              user.dataValues;
            const token = jwt.sign(userRef, process.env.SECRET_KEY, {
              expiresIn: "24h",
            });
            return res
              .status(200)
              .json({ success: true, token: token, user: userRef });
          } else {
            return res
              .status(409)
              .json({ success: false, error: "Invalid credentials. 😥" });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error. 😥" });
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      interface forgotEmailInterface {
        email: string;
      }
      let { email } = req.body as unknown as forgotEmailInterface;

      if (!email) {
        return res.status(400).json({ error: "Bad request. 😥" });
      } else {
        let user = await User.findOne({ where: { email: email } });
        if (!user) {
          return res.status(404).json({ error: "Invalid email. 😥" });
        } else {
          interface user {
            username: string;
          }

          const { username } = (await User.findOne({
            where: { email: email },
          })) as unknown as user;
          let mail = await sendForgotEmail(email, username);
          if (mail) {
            return res.status(200).json({ sucess: true });
          } else {
            res
              .status(500)
              .json({ error: "We are unable to send mail at this time. 😔" });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error." });
    }
  },
  resetPassword: async (req: Request, res: Response) => {
    try {
      try {
        interface resetPasswordInterface {
          token: string;
          password: string;
        }
        const { token, password } =
          req.body as unknown as resetPasswordInterface;
        const secretKey = process.env.SECRET_KEY;

        const decoded = jwt.verify(token, secretKey);
        if (!decoded.purpose || !decoded.email) {
          throw new Error("Invalid token");
        }

        if (decoded.purpose !== "reset_password") {
          throw new Error("Invalid token.");
        }

        const email = decoded.email;
        const SALT_ROUNDS = process.env.SALT_ROUNDS as unknown as string;
        const saltRounds: number = parseInt(SALT_ROUNDS || "10", 10);
        const enc = await bcrypt.hash(password, saltRounds);

        const update = User.update(
          { password: enc },
          { where: { email: email } }
        ).then((user) => {
          if (user) {
            res
              .status(200)
              .json({ success: true, message: "Password changed." });
          } else {
            return res.status(500).json({ error: "Server error. 😥" });
          }
        });
      } catch (err) {
        return res.status(409).json({ error: err });
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error. 😥" });
    }
  },
};

export default Auth;
