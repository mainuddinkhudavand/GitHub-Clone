const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    const fileName = path.basename(filePath);
    const resolvedPath = path.resolve(process.cwd(), filePath);

    if (!resolvedPath.startsWith(process.cwd())) {
      console.error("Security error: Path traversal detected!");
      return;
    }

    await fs.mkdir(stagingPath, { recursive: true });
    await fs.copyFile(resolvedPath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} added to the staging area!`);
  } catch (err) {
    console.error("Error adding file : ", err.message);
  }
}

module.exports = { addRepo };
