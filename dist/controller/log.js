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
exports.saveLog = exports.getLogs = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) | 1;
        const pageSize = parseInt(req.query.pageSize) | 100;
        const skip = (page - 1) * pageSize;
        //Filters(optional)
        const entity = req.query.entity;
        const type = req.query.type;
        const action = req.query.action;
        const user = req.query.user;
        const program = req.query.program;
        const dateStart = req.query.dateStart;
        const dateEnd = req.query.dateEnd;
        const where = {};
        if (entity)
            where.entity = entity;
        if (type)
            where.type = type;
        if (action)
            where.action = action;
        if (user)
            where.user = user;
        if (program)
            where.program = program;
        if (dateStart || dateEnd) {
            where.createdAt = {};
            if (dateStart)
                where.createdAt.gte = new Date(dateStart);
            if (dateEnd)
                where.createdAt.lte = new Date(dateEnd);
        }
        const logs = yield prisma.log.findMany({
            where,
            skip,
            take: pageSize
        });
        res.json({
            msg: 'ok',
            error: false,
            records: logs.length,
            page,
            data: logs
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting logs',
            error
        });
    }
});
exports.getLogs = getLogs;
const saveLog = (entity, type, action, short_msg, long_msg, user, ip, program, version) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newLog = yield prisma.log.create({
            data: {
                entity,
                type,
                action,
                short_msg,
                long_msg,
                user,
                ip,
                program,
                version
            }
        });
        console.debug({
            error: false,
            msg: "Log created successfully",
            data: newLog,
        });
    }
    catch (error) {
        console.warn(error);
    }
});
exports.saveLog = saveLog;
//# sourceMappingURL=log.js.map