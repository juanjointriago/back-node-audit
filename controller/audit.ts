import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const activeTrigger = async(req: Request, res: Response) => {
    try {
        const {entity} = req.body;
        await prisma.$executeRawUnsafe(`SELECT enable_tracking('public."${entity}"'::regclass);`);

        res.json({
            msg: `Audit activated on Table ${entity}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong',
            error
        });
    } finally {
        await prisma.$disconnect();
    }
}

export const inactiveTrigger = async(req: Request, res: Response) => {
    try {
        const {entity} = req.body;
        await prisma.$executeRawUnsafe(`SELECT disable_tracking('public."${entity}"'::regclass);`);

        res.json({
            msg: `Audit inactivated on Table ${entity}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong',
            error
        });
    }
}

export const getEntities = async(req: Request, res: Response) => {
    try {
        const response = await prisma.$queryRaw`
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
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Error getting entitys',
            error
        });
    }
}