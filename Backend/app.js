const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const nodemailer = require("nodemailer");


const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual URL of your React app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Initialize Sequelize with your PostgreSQL database connection
const sequelize = new Sequelize('vewbleav', 'vewbleav', 'krsM-EZ23Hh_vPC-oJGp9c4vTIs0wLGP', {
  host: 'rosie.db.elephantsql.com',
  dialect: 'postgres',
  logging: console.log, // Add this line
});

require('./userDetails')(sequelize); // Pass sequelize instance to userDetails


// Routes
// Add your routes here

// Create tables if they don't exist




// Routes
// ... (remaining code stays the same)


// Define a User model
const User = sequelize.define("Users", {
  fname: DataTypes.STRING,
  lname: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING, // Store hashed passwords
  userType: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
});

// Create tables if they don't exist
sequelize.sync();

// Routes

//----------------------------------------------------------

//----------------------------------------------------------
// Registration route
app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType, phone, address } = req.body;
  const saltRounds = 10; // Number of salt rounds for bcrypt

  try {
    const oldUser = await User.findOne({ where: { email } });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      fname,
      lname,
      email,
      password: hashedPassword, // Store the hashed password
      userType,
      phone,
      address,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

/*const saltRounds = 10; // Number of salt rounds (adjust as needed)

// Retrieve users with plain text passwords from the database
const usersToUpdate = [
  { email: 'mjthakur@gmail.com', password: '1925' },
  { email: 'abc@gmail.com', password: '1925' },
];

usersToUpdate.forEach(async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    // Update the user's password with the hashed value in the database
    const updatedUser = await User.update(
      { password: hashedPassword },
      { where: { email: user.email } }
    );
    console.log(`Updated password for ${user.email}`);
  } catch (err) {
    console.error(`Error updating password for ${user.email}: ${err}`);
  }
});*/


// Other routes...



// Rest of your routes remain the same


// Your login and other routes remain unchanged


app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ error: "User Not found" });
    }

    const storedPassword = user.password.trim(); // Make sure to trim stored password
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (passwordMatch) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: '15m',
      });

      return res.json({ status: 'ok', user });
    } else {
      console.log('Invalid Password');
      return res.json({ status: 'error', error: 'Invalid Password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.json({ status: 'error', error: 'Login failed' });
  }
});

app.post("/Users", async (req, res) => {
  const { token } = req.body;
  console.log("Received request to fetch user data with token:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Continue with data retrieval using decoded.email
    const useremail = decoded.email;

    User.findOne({ where: { email: useremail } })
      .then((data) => {
        if (data) {
          res.json({ status: "ok", data: data });
        } else {
          res.json({ status: "error", data: "User not found" });
        }
      })
      .catch((error) => {
        res.json({ status: "error", data: error });
      });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.json({ status: "error", data: "Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.json({ status: "error", data: "JWT verification error" });
    } else {
      res.json({ status: "error", data: "Unknown error" });
    }
  }
  
 
});
/*app.post("/Users", async (req, res) => {
  const { token } = req.body; // Extract token from the request body
  console.log("Received request to fetch user data with token:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Continue with data retrieval using decoded.email
    const useremail = decoded.email;

    User.findOne({ where: { email: useremail } })
      .then((data) => {
        if (data) {
          res.json({ status: "ok", user: data }); // Return the user data
        } else {
          res.json({ status: "error", data: "User not found" });
        }
      })
      .catch((error) => {
        res.json({ status: "error", data: error });
      });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.json({ status: "error", data: "Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.json({ status: "error", data: "JWT verification error" });
    } else {
      res.json({ status: "error", data: "Unknown error" });
    }
  }
});*/








app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) { }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const userType = req.query.userType;
    let filteredUsers;

    if (userType === "all") {
      filteredUsers = await User.findAll();
    } else {
      filteredUsers = await User.findAll({ where: { userType } });
    }

    res.send({ status: "ok", data: filteredUsers });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", data: error });
  }
});

app.get("/Users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const users = await User.findAll({
      limit,
      offset,
    });

    const totalUsers = await User.count();

    const pageCount = Math.ceil(totalUsers / limit);

    const results = {
      users,
      totalUsers,
      pageCount,
    };

    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/deleteUser", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ status: "error", error: "User Not Found" });
    }

    await user.destroy(); // Delete the user

    res.send({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", data: error });
  }
});



app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then(data => {
      res.send({ status: "ok", data: data })
    })

  } catch (error) {

  }
})

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=allUser.length;
  results.pageCount=Math.ceil(allUser.length/limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results)
}) *app.listen(5000, () => {
  console.log('Server Started');
});     
module.exports = sequelize;    