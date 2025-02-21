import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    if (!authHeader) {
      return res.status(403).json("unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (verified) {
      req.user = verified;
      next();
    }
  } catch (error) {
    return res.status(401).json({ status: "error", error: error.message });
  }
};
