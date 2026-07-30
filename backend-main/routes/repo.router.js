const express = require("express");
const repoController = require("../controllers/repoController");
const authMiddleware = require("../middleware/authMiddleware");

const repoRouter = express.Router();

repoRouter.post("/repo/create", authMiddleware, repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", authMiddleware, repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", authMiddleware, repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", authMiddleware, repoController.toggleVisibilityById);

module.exports = repoRouter;

