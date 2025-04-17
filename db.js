const { Sequelize, Model } = require("sequelize");

const systemUserModel = require("./Models/SystemUser");
const UserModel = require("./Models/Users");
const OtpModel = require("./Models/Otp");
const BlockedNumberModel = require("./Models/BlockedNumbers");


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,

  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_PROVIDER,
  }
);

const systemUser = systemUserModel(sequelize);
const User = UserModel(sequelize);
const Otp = OtpModel(sequelize);

const createtable = () => {
  try {
    sequelize.authenticate();

        systemUser.sync({ alter: true })
        User.sync({ alter: true })
        Otp.sync({ alter: true })
        BlockedNumbers.sync({ alter: true })
        Payments.sync({ alter: true })
        Donate.sync({ alter: true })


       

    console.log("table created");
  } catch (error) {
    console.log("error" + error);
  }
};

module.exports = { sequelize, createtable };
