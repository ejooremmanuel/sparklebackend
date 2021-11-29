const User = require("../../models/User");
const { hashSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
// const cookieSession = require("cookie-session");
// @route POST api/auth/register

const signup = async (req, res) => {
  try {
    const { name, username, password, answer1, answer2, answer3 } = req.body;
    if (!name || !username || !password || !answer1 || !answer2 || !answer3) {
      return res
        .status(400)
        .json({ success: false, msg: "Please fill all fields" });
    }
    // Check password length is greater than 8
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 8 characters long",
      });
    }

    // Check for existing user
    const verifyUser = await User.findOne({ username });
    if (verifyUser) {
      return res.status(400).json({
        success: false,
        msg: "Username already exists",
      });
    }

    // hash password
    const hashedPassword = hashSync(password, 10);

    // Create new user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      secretanswers: [answer1, answer2, answer3],
    });

    if (!newUser) {
      return res.status(500).json({
        success: false,
        msg: "An error occurred",
      });
    }
    // save user to db
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "Registration successfull! You can now log in",
    });
  } catch ({ message }) {
    res.status(500).json({ success: false, msg: message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter all fields" });
    }
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Username does not exist",
      });
    }
    // Check password
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Incorrect password",
      });
    }
    // Create token
    const token = sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "1hr",
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch ({ message }) {
    res.status(500).json({ success: false, msg: message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username, answer, password } = req.body;
    if (!username || !answer) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter all fields" });
    }
    // Check for existing user
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(400).json({
        success: false,
        msg: "Username does not exist",
      });
    }
    // Check answer
    if (findUser.secretanswers.includes(answer)) {
      await User.findOneAndUpdate(
        { username },
        { password: hashSync(password, 10) }
      );
      return res.status(200).json({
        success: true,
        msg: "Password reset successfull. You can now login!",
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Incorrect answer",
      });
    }
  } catch ({ message }) {
    res.status(500).json({ success: false, msg: message });
  }
};

module.exports = {
  signup,
  login,
  resetPassword,
};
