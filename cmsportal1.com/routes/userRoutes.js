const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post(
  "/signup",
  // authController.protect,
  // authController.restrictTo("superAdmin"),
  authController.signup
);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updatePassword", authController.updatePassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch("/updateme", authController.protect, userController.updateMe);

router.route("/").get(authController.protect, userController.getAllUsers);
//.post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("blogger", "marketer", "superAdmin"),
    userController.deleteUser
  );
module.exports = router;
