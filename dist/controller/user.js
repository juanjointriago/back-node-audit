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
exports.deleteUserById = exports.updateUserById = exports.saveUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({ where: { active: 1 } });
        res.json({
            msg: 'ok',
            error: false,
            records: users.length,
            data: users
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting users',
            error
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id)
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const existingUser = yield prisma.user.findFirst({ where: { id: id } });
        if (!existingUser)
            res.status(404).json({ msg: 'User not found', error: false, data: [] });
        res.json({
            msg: 'ok',
            error: false,
            records: 1,
            data: existingUser
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
exports.getUserById = getUserById;
const saveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, profileId } = req.body;
        const newUser = yield prisma.user.create({ data: { username, password, email, profileId } });
        res.json({
            newUser,
            msg: `User ${newUser.id} created`
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        });
    }
});
exports.saveUser = saveUser;
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, username, password, email, profileId } = req.body;
        if (!id)
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const updatingUser = yield prisma.user.findFirst({ where: { id: id } });
        if (!updatingUser)
            res.status(404).json({ msg: 'User not found', error: false, data: [] });
        yield prisma.user.update({
            where: {
                id: id
            },
            data: {
                username, password, email, profileId
            }
        });
        res.status(200).json({
            msg: `User ${id} updated`,
            error: false,
            records: 1
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        });
    }
});
exports.updateUserById = updateUserById;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id)
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        yield prisma.user.update({
            where: {
                id: id
            },
            data: {
                active: 0
            }
        });
        res.status(200).json({
            msg: `User ${id} deleted`,
            error: false
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        });
    }
});
exports.deleteUserById = deleteUserById;
//# sourceMappingURL=user.js.map