const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
}

async function signup(req, res) {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Please provide username, email, and password!" });
  }

  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User or email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId;

    const secret = process.env.JWT_SECRET_KEY || "default_jwt_secret_key_change_me_in_prod";
    const token = jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
    res.status(201).json({ token, userId });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Server error");
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password!" });
  }

  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const secret = process.env.JWT_SECRET_KEY || "default_jwt_secret_key_change_me_in_prod";
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getAllUsers(req, res) {
  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getUserProfile(req, res) {
  const currentID = req.params.id;

  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid user ID format!" });
  }

  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { _id: new ObjectId(currentID) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { username, name, email, password, avatarUrl, bio, company, location, website, twitter, themePreference } = req.body;

  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid user ID format!" });
  }

  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    if (username) {
      const existingUser = await usersCollection.findOne({
        username,
        _id: { $ne: new ObjectId(currentID) },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken!" });
      }
    }

    let updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
    if (bio !== undefined) updateFields.bio = bio;
    if (company !== undefined) updateFields.company = company;
    if (location !== undefined) updateFields.location = location;
    if (website !== undefined) updateFields.website = website;
    if (twitter !== undefined) updateFields.twitter = twitter;
    if (themePreference !== undefined) updateFields.themePreference = themePreference;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentID) },
      { $set: updateFields },
      { returnDocument: "after", projection: { password: 0 } }
    );

    const updatedUser = result.value !== undefined ? result.value : result;
    if (!updatedUser || !updatedUser._id) {
      return res.status(404).json({ message: "User not found!" });
    }

    delete updatedUser.password;
    res.send(updatedUser);
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid user ID format!" });
  }

  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during deleting profile : ", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
