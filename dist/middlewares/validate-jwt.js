"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jwt = require('jsonwebtoken');
const validateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('auth-token');
    console.log(token);
    if (!token) {
        res.status(401).json({
            msg: 'Non-Authenticated'
        });
    }
    try {
        jwt.verify(token, process.env.SECRETKEY);
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }
    next();
});
exports.validateJWT = validateJWT;
//# sourceMappingURL=validate-jwt.js.map