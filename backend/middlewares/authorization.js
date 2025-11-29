const jwt = require("jsonwebtoken");

const authorizationMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.send({ message: "Access Denied. No token provided.", flag: 0 })
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_key);
        req.user = decoded;
        next();
    } catch (error) {
        res.send({ message: "Invalid token", flag: 0 })
    }
}

module.exports = authorizationMiddleware;