require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");

app.use(express.json());

const tipDB = [
  {
    username: "user1",
  },
  {
    username: "user2",
  },
];

app.get("/", (req, res) => {
  res.send("เมืองทิพย์ยินดีตอนรับ");
});

app.post("/login", (req, res) => {
  const token = generateToken(req.body.username);
  res.json({ auth_jwt: token });
});

app.post("/me", authenticationToken, (req, res) => {
  res.json(tipDB.filter((t) => t.username === req.user.user[0].username));
});

function generateToken(username) {
  const user = tipDB.filter((t) => t.username === username);
  return jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET);
}

function authenticationToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log("====================================");
  console.log("ฝ่ายความมั่นคงเมืองทิพย์ทำงาน....");
  console.log(`http://localhost:${port}`);
  console.log("====================================");
});
