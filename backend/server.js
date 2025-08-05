const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const {dbConnect} = require('./config/db');

const indexRoutes = require ('./routes/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

dbConnect();
app.use(cors());
app.use(express.json());
app.use('/api/', indexRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Wanderlog API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
