import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);  // Log the error for debugging
    return res.status(401).json({ status: false, message: "Failed to authenticate token", err });
  }
};


// ===================================================================================================

export const verifyTokenuser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Failed to authenticate token.' });
        }

        // Attach user ID to request object
        req.user = { id: decoded.id };
        console.log((req.user) + "=__=")
        next();
    });
};


