const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3002;

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Rate Limiting Middleware (Brute Force & DoS Protection)
  const rateLimitMap = new Map();
  app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || "global";
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 300;

    const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
    }
    rateLimitMap.set(ip, record);

    if (record.count > maxRequests) {
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    next();
  });

  app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(express.json({ limit: "10mb" }));

  let mongoURI = process.env.MONGODB_URI;

  if (!mongoURI || mongoURI.startsWith("memory") || mongoURI.includes("your_mongodb_connection_string_here")) {
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      console.log("Using temporary in-memory MongoDB instance at:", mongoURI);
    } catch (e) {
      // Fall back to env mongoURI
    }
  }

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch(async (err) => {
      console.error("Unable to connect to primary MONGODB_URI:", err.message);
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        console.log("Starting temporary in-memory MongoDB fallback server...");
        const mongoServer = await MongoMemoryServer.create();
        const fallbackURI = mongoServer.getUri();
        await mongoose.connect(fallbackURI);
        console.log("MongoDB connected successfully to temporary in-memory server at:", fallbackURI);
      } catch (fallbackErr) {
        console.error("Fallback error:", fallbackErr.message);
      }
    });

  app.use("/", mainRouter);

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}

// Check if run directly without subcommands
const argv = hideBin(process.argv);
if (argv.length === 0) {
  startServer();
} else {
  yargs(argv)
    .command("start", "Starts a new server", {}, startServer)
    .command("init", "Initialise a new repository", {}, initRepo)
    .command(
      "add <file>",
      "Add a file to the repository",
      (yargs) => {
        yargs.positional("file", {
          describe: "File to add to the staging area",
          type: "string",
        });
      },
      (argv) => {
        addRepo(argv.file);
      }
    )
    .command(
      "commit <message>",
      "Commit the staged files",
      (yargs) => {
        yargs.positional("message", {
          describe: "Commit message",
          type: "string",
        });
      },
      (argv) => {
        commitRepo(argv.message);
      }
    )
    .command("push", "Push commits to S3", {}, pushRepo)
    .command("pull", "Pull commits from S3", {}, pullRepo)
    .command(
      "revert <commitID>",
      "Revert to a specific commit",
      (yargs) => {
        yargs.positional("commitID", {
          describe: "Commit ID to revert to",
          type: "string",
        });
      },
      (argv) => {
        revertRepo(argv.commitID);
      }
    )
    .demandCommand(1, "You need at least one command")
    .help().argv;
}
