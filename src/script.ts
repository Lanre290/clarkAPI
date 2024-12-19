import dotenv from "dotenv";
import Auth from "./controllers/Auth";
import middlewares from "./middlewares/verifyToken";
import userActions from "./controllers/UserActions";
const express = require("express");
const session = require("express-session");
const cors = require("cors");
var bodyParser = require("body-parser");
const sequelize = require("./setup/Sequelize");


require("./setup/Sequelize");

dotenv.config();


const app = express();


const FRONTEND_URL: any = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 8000;

interface corsInterface {
  origin: string;
  methods: string[];
  allowedHeaders?: string[];
}

const corsOption: corsInterface = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //TO-DO: Set to true in production
  })
);

// Auth routes
app.post("/api/v1/auth/signup", Auth.signup);
app.post("/api/v1/auth/login", Auth.login);
app.post("/api/v1/auth/verify-otp", Auth.verifyOTP);
app.post("/api/v1/resend-otp", Auth.resendOTP);
app.post("/api/v1/forgot-password", Auth.forgotPassword);
app.post("/api/v1/reset-password", Auth.resetPassword);


app.get("/api/v1/user", middlewares.authenticateToken, userActions.getUser);



const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log("Server error.", error);
  }
};


startServer();