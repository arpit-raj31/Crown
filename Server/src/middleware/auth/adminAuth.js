import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin.model.js';


export const authenticateAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(403).json({ message: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};


export const secretKeyMiddleware = async (req, res, next) => {
    const { secretKey } = req.body;
  
    // If the secretKey is provided, check its validity
    if (secretKey) {
      const admin = await Admin.findOne({ secretKey });
  
      if (admin) {
        // Attach admin info to the request object and proceed
        req.admin = admin;
        return next();
      } else {
        return res.status(403).json({ message: 'Invalid secret key' });
      }
    }
  
    // If no secretKey, continue to the next step (username/password check)
    next();
  };
  