const jwt = require('jsonwebtoken');

const ValidateToken = (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      error: true,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Token is valid",
      success: true,
      user: decoded,
    });
  });
};

module.exports = ValidateToken;
