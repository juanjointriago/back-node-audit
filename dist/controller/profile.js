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
exports.deleteProfileById = exports.updateProfileById = exports.saveProfile = exports.getProfileById = exports.getAllProfiles = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield prisma.profile.findMany({ where: { active: 1 } });
        res.json({
            msg: 'ok',
            error: false,
            records: profiles.length,
            data: profiles
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting profiles',
            error
        });
    }
});
exports.getAllProfiles = getAllProfiles;
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id)
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const existingProfile = yield prisma.profile.findFirst({ where: { id: id } });
        if (!existingProfile)
            res.status(404).json({ msg: 'Profile not found', error: false, data: [] });
        res.json({
            msg: 'ok',
            error: false,
            records: 1,
            data: existingProfile
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting profile',
            error: error,
            data: []
        });
    }
});
exports.getProfileById = getProfileById;
const saveProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const newProfile = yield prisma.profile.create({ data: { name, description } });
        res.json({
            newProfile,
            msg: `Profile ${newProfile.id} created`
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong',
            error
        });
    }
});
exports.saveProfile = saveProfile;
const updateProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, description } = req.body;
        if (!id)
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const updatingProfile = yield prisma.profile.findFirst({ where: { id: id } });
        if (!updatingProfile)
            res.status(404).json({ msg: 'Profile not found', error: false, data: [] });
        yield prisma.profile.update({
            where: {
                id: id
            },
            data: {
                name, description
            }
        });
        res.status(200).json({
            msg: `Profile ${id} updated`,
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
exports.updateProfileById = updateProfileById;
const deleteProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id)
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        yield prisma.profile.update({
            where: {
                id: id
            },
            data: {
                active: 0
            }
        });
        res.status(200).json({
            msg: `Profile ${id} deleted`,
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
exports.deleteProfileById = deleteProfileById;
//# sourceMappingURL=profile.js.map