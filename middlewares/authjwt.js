const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    if (!token) {
      return res.status(403).json({
        message: "You need to be logged in to perform this action.",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "You are not authorized. Token is invalid." });
      }
      req.user = decoded.findUser;
      next();
    });
  } catch {
    ({ message }) => {
      res.status(500).json({ message });
    };
  }
};

module.exports = verifyToken;
