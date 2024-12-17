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
exports.logout = exports.login = void 0;
const client_1 = require("@prisma/client");
const generate_jwt_1 = require("../helpers/generate-jwt");
const password_1 = require("../helpers/password");
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        let generatedToken;
        let validPassword = false;
        if (!username || !password)
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const existingUser = yield prisma.user.findFirst({ where: { username: username, active: 1 } });
        if (!existingUser)
            res.status(404).json({ msg: 'User not found', error: true, data: [] });
        validPassword = yield (0, password_1.validatePassword)(password, existingUser.password);
        if (!validPassword)
            res.status(404).json({ msg: 'Invalid User/Password', error: false, data: [] });
        generatedToken = yield (0, generate_jwt_1.generateJWT)(existingUser.id);
        res.json({
            msg: 'ok',
            error: false,
            records: 1,
            data: existingUser,
            token: generatedToken || ''
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting user',
            error: error,
            data: []
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.logout = logout;
//# sourceMappingURL=auth.js.map