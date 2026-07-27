const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
  const { title, description, repository } = req.body;
  const targetRepoId = req.params.id || repository;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required!" });
  }

  if (!targetRepoId || !mongoose.Types.ObjectId.isValid(targetRepoId)) {
    return res.status(400).json({ error: "Valid Repository ID is required!" });
  }

  try {
    const issue = new Issue({
      title,
      description,
      repository: targetRepoId,
    });

    await issue.save();

    // Sync issue to repository document
    await Repository.findByIdAndUpdate(targetRepoId, {
      $push: { issues: issue._id },
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated", issue });
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    const query = id && mongoose.Types.ObjectId.isValid(id) ? { repository: id } : {};
    const issues = await Issue.find(query).populate("repository");

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const issue = await Issue.findById(id).populate("repository");

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
