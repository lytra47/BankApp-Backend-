//SErver CReation

// 1. IMport EXpress
const express = require("express");

// IMPORT jsonwebtoken
const jwt = require("jsonwebtoken");

// IMPORT cors
const cors = require("cors");

//import
const dataService = require("./service/data.service");

// 2. CReate SErver APp
const app = express();
// to parse JSON
app.use(express.json());

//to use cors to share data with others
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// Application specific Middleware
//not needed for thie project
const appMiddleware = (req, res, next) => {
  next();
};
app.use(appMiddleware);

// ROUTER Specific middlware - Token validate
const jwtMiddleware = (req, res, next) => {
  try {
    console.log("Router specific middleware. //////////////////");
    const token = req.headers["x-access-token"];
    const data = jwt.verify(token, "supersecretkey12345");
    console.log(data);
    next();
  } catch {
    res.status(422);
    res.json({
      statusCode: 422,
      status: false,
      message: "Please login",
    });
  }
};

// 3. HTTP REquest REsolve

// Bank APp Request REsolving

// Register api
app.post("/register", (req, res) => {
  console.log(req.body);
  dataService
    .register(req.body.userName, req.body.acno, req.body.passWord)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});
// Login api
app.post("/login", (req, res) => {
  console.log(req.body);
  dataService.login(req.body.acno, req.body.pass).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// deposit api
app.post("/deposit", jwtMiddleware, (req, res) => {
  console.log(req.body);
  dataService
    .deposit(req.body.acno, req.body.amount, req.body.pass)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// withdraw api
app.post("/withdraw", jwtMiddleware, (req, res) => {
  console.log(req.body);
  dataService
    .withdraw(req.body.acno, req.body.amount, req.body.pass)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// transaction api
app.post("/transaction", jwtMiddleware, (req, res) => {
  console.log(req.body);
  try {
    const result = dataService.getTransaction(req.body.acno).then((result) => {
      res.status(result.statusCode).json(result);
    });
  } catch {
    res.status(422).json({
      statusCode: 422,
      status: false,
      message: "No transaction has been done.",
    });
  }
});

//onDelete api
app.delete("/onDelete/:acno", (req, res) => {
  dataService.onDelete(req.params.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// 4. SEt UP POrt NUmber
app.listen(3000, () => {
  console.log("Server Started at PORT : 3000");
});
