// IMPORT jsonwebtoken
const jwt = require("jsonwebtoken");

//IMPRT DB
const db = require("./db");

//database
userDetails = {
  1000: {
    acno: 1000,
    userName: "neil",
    passWord: 1000,
    balance: 5000,
    transaction: [],
  },
  1001: {
    acno: 1001,
    userName: "max",
    passWord: 1001,
    balance: 5000,
    transaction: [],
  },
  1002: {
    acno: 1002,
    userName: "lien",
    passWord: 1002,
    balance: 5000,
    transaction: [],
  },
};

// register
const register = (userName, acno, passWord) => {
  // asynchronus
  return db.User.findOne({ acno }).then((user) => {
    if (user) {
      return {
        statusCode: 401,
        status: false,
        message: "User already exist, please login",
      };
    } else {
      const newUser = new db.User({
        acno,
        userName,
        passWord,
        balance: 0,
        transaction: [],
      });
      newUser.save();
      return {
        statusCode: 200,
        status: true,
        message: "Register successful, please login",
      };
    }
  });
};

// login
const login = (acno, pass) => {
  //asynchronous
  return db.User.findOne({ acno, password: pass }).then((user) => {
    if (user) {
      currentUsername = user.userName;
      currentAcno = user.acno;

      //   token generation
      const token = jwt.sign({ currentAcno: acno }, "supersecretkey12345"); //to store acno in token. {optional}

      return {
        statusCode: 200,
        status: true,
        message: "Login, Successful",
        token,
        currentUsername,
        currentAcno,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Incorrect account number / password",
      };
    }
  });
};

// deposit
const deposit = (acno, amount, pass) => {
  amount = parseInt(amount);
  //asynchronous
  return db.User.findOne({ acno, password: pass }).then((user) => {
    if (user) {
      user.balance += amount;
      user["transaction"].push({
        type: "Credit",
        amount,
      });
      user.save();
      return {
        statusCode: 200,
        status: true,
        message: `${amount} credited. Current balance is ${user.balance}`,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Wrong password or Account number.",
      };
    }
  });
};

// withdraw
const withdraw = (acno, amount, pass) => {
  amount = parseInt(amount);
  //asynchronous
  return db.User.findOne({ acno, password: pass }).then((user) => {
    if (user) {
      if (user.balance >= amount) {
        user.balance -= amount;
        user["transaction"].push({
          type: "Debit",
          amount,
        });
        user.save();
        console.log(userDetails);
        return {
          statusCode: 200,
          status: true,
          message: `${amount} debited. Current balance is ${user.balance}`,
        };
      } else {
        return {
          statusCode: 401,
          status: false,
          message: `Insufficient balance. Only ${user.balance} in account.`,
        };
      }
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Wrong password or Account number.",
      };
    }
  });
};

// TRANSACTIONS
const getTransaction = (acno) => {
  //asynchronous
  return db.User.findOne({ acno }).then((user) => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Incorrect Account number.",
      };
    }
  });
};

//onDelete
const onDelete = (acno) => {
  return db.User.deleteOne({ acno }).then((result) => {
    if (result) {
      return {
        statusCode: 200,
        status: true,
        message: "Deleted successfully.",
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Incorrect Account number.",
      };
    }
  });
};

// to export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  onDelete,
};
