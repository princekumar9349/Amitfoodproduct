const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role === 'admin') {
                req.user = await Admin.findById(decoded.id).select('-password');
            } else if (decoded.role === 'customer') {
                req.user = await User.findById(decoded.id).select('-password');
            }

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const customer = (req, res, next) => {
    if (req.user && req.user.role === 'customer') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a customer' });
    }
};

module.exports = { protect, admin, customer };
