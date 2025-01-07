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
exports.getEntities = exports.inactiveTrigger = exports.activeTrigger = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const activeTrigger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity } = req.body;
        yield prisma.$executeRawUnsafe(`SELECT enable_tracking('public."${entity}"'::regclass);`);
        res.json({
            msg: `Audit activated on Table ${entity}`
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong',
            error
        });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.activeTrigger = activeTrigger;
const inactiveTrigger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity } = req.body;
        yield prisma.$executeRawUnsafe(`SELECT disable_tracking('public."${entity}"'::regclass);`);
        res.json({
            msg: `Audit inactivated on Table ${entity}`
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
exports.inactiveTrigger = inactiveTrigger;
const getEntities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.$queryRaw `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' and table_name not like '%migrations%' and table_name not like 'Log';`;
        res.json({
            msg: 'ok',
            error: false,
            data: response
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error getting entitys',
            error
        });
    }
});
exports.getEntities = getEntities;
//# sourceMappingURL=audit.js.map