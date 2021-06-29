"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const jwt = require('jsonwebtoken');
exports.authCheck = (req, res, next) => {
    try {
        let token;
        if (req && req.headers && req.headers['authorization']) {
            token = req.headers['authorization'].split(' ')[1];
        }
        if (token == null) {
            res.status(404).send('Missing Authorization header.');
        }
        else {
            jwt.verify(token, process.env.JWT_KEY, (err, data) => {
                if (err) {
                    res.status(404).send('Authentication failed.');
                }
                else {
                    req.user = data;
                    next();
                }
            });
        }
    }
    catch (error) {
        next(error);
    }
};
