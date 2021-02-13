const express = require("express");
const router = express.Router();
const { login, registerUser, getUser, deleteUser, getUsers, createUser } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");
router.route("/register").post(registerUser);
router.route("/login").post(login);
router
  .route("/users/:id")
  .get(protect, getUser)
  .delete(protect, deleteUser);

  router
  .route("/users")
  .get(protect, getUsers)
  .post(protect, createUser)
module.exports = router;