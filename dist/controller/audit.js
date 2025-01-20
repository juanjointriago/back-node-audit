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
exports.sendEmailLog = exports.inactiveNotify = exports.activeNotify = exports.getEntities = exports.inactiveTrigger = exports.activeTrigger = void 0;
const client_1 = require("@prisma/client");
const mail_1 = require("./mail");
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
        const response = yield prisma.$queryRaw `
        SELECT
                t.table_name,
            MAX(CASE WHEN pt.tgname IS NOT NULL THEN 1 ELSE 0 END) AS has_audited
        FROM information_schema.tables t
        LEFT JOIN pg_trigger pt
        ON pt.tgrelid = (quote_ident(t.table_name))::regclass and NOT pt.tgisinternal
        WHERE
            t.table_schema = 'public'
            and t.table_type = 'BASE TABLE'
            and t.table_name not like '%migrations%' and t.table_name not like 'Log'
        GROUP BY t.table_name;
        `;
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
const activeNotify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity } = req.body;
        yield prisma.notifyEntity.upsert({
            create: { entity, notify: 1 },
            update: { notify: 1 },
            where: { entity }
        });
        res.status(200).json({
            msg: `Notify activated on Table ${entity}`
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
exports.activeNotify = activeNotify;
const inactiveNotify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entity } = req.body;
        const existingEntity = yield prisma.notifyEntity.findFirst({ where: { entity } });
        if (!existingEntity)
            res.status(404).json({ msg: 'Entity not found', error: false, data: [] });
        yield prisma.notifyEntity.update({
            where: {
                entity: entity
            },
            data: {
                notify: 0
            }
        });
        res.status(200).json({
            msg: `Notify inactivated on Table ${entity}`
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
exports.inactiveNotify = inactiveNotify;
const sendEmailLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { emails, textEmail, subject } = req.body;
        if (!(emails || textEmail || subject))
            res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        (0, mail_1.sendEmail)(process.env.EMAIL || '', emails, '', textEmail, subject, 'Info');
        res.status(200).json({ msg: 'Email sent', error: false, data: [] });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error: error,
            data: []
        });
    }
});
exports.sendEmailLog = sendEmailLog;
//# sourceMappingURL=audit.js.map