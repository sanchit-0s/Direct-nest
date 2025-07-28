const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv =require('dotenv');
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const chatRoutes = require("./routes/chats");
const paymentRoutes = require("./routes/payments");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chats", chatRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err)); //mongo db ko connect kiya hai MONGO_URI se joh .env file mai hai

  app.listen(3001, '0.0.0.0', () => {    //port ko run karwa rhe hai 3001 mai
    console.log("server is running on port 3001");
  })