// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach user payload to the request
        req.user = decoded;

        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = authenticate;
