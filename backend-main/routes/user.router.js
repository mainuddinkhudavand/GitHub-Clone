const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeOwner } = require("../middleware/authorizeMiddleware");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", authMiddleware, authorizeOwner, userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", authMiddleware, authorizeOwner, userController.deleteUserProfile);

module.exports = userRouter;

