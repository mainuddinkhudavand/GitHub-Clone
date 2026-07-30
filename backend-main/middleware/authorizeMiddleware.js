function authorizeOwner(req, res, next) {
  const paramId = req.params.id || req.params.userID;
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (paramId && req.user.id.toString() !== paramId.toString()) {
    return res.status(403).json({ message: "Forbidden: You are not authorized to modify this resource" });
  }

  next();
}

module.exports = { authorizeOwner };
