const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log(email, username, password);
    if (!email || !username || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: "User already Exist",
      });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    const createdUser = await User.findById(newUser._id).select("-password");
    if (!createdUser) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
    res.status(201).json({
      user: createdUser,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Backend Error in signup", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({
        message: "All Field required",
      });
    }
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json({
        message: "user doesn't exits",
      });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );
    const loggedInUser = await User.findById(validUser._id).select("-password");
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        user: loggedInUser,
        token,
        message: "User logged in successfull",
      });
  } catch (error) {
    console.log("Backend Error in singin", error);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};
const google = async (req, res) => {
  const { name, email, photoUrl } = req.body;
try {
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
    console.log("if me hoon")
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        process.env.JWT_SECRET
      );
      const loggedInUser = await User.findById(existingUser._id).select("-password");
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          user: loggedInUser,
          token,
          message: "User logged in successfull",
        });
    } else {
      console.log("eles me hoon")
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword,10);
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
        password : hashedPassword,
        email : email,
        profilePicture : photoUrl,
      })
      await newUser.save();
      
      const token = jwt.sign({
        id:newUser._id
      },
        process.env.JWT_SECRET
      )
      const loggedInUser = await User.findOne({email}).select("-password");
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          user: loggedInUser,
          token,
          message: "User logged in successfull",
        });
    }
} catch (error) {
  return res.status(500).json({
    message : "Internal Server Error"
  })
}
};
module.exports = {
  signup,
  signin,
  google,
};
