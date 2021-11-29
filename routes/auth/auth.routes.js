const router = require("express").Router();
const {
  signup,
  login,
  resetPassword,
} = require("../../controllers/auth/auth.controllers");

const verifyUserToken = require("../../middlewares/authjwt");

router.post("/signup", signup);
router.post("/login", login);
router.put("/password-reset", verifyUserToken, resetPassword);
router.post("/password-reset", verifyUserToken, resetPassword);

module.exports = router;
