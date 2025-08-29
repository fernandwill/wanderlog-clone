const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "wanderlog",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "AirbusA330941",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  }
);

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL database connected.");
  } catch (error) {
    console.error("Database connection failed.", error);
    process.exit(1);
  }
};

module.exports = { sequelize, dbConnect };
