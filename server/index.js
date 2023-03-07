const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
import User from "./models/User";

dotenv.config();
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(console.log("Connected to MONGODB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome!!");
});

app.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const user = await new User.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.send(500).json("Wrong Credentials");
    }

    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate) return res.send(500).json("Wrong Password");
    
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
