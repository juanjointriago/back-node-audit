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
        const response = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' and table_name not like '%migrations%' and table_name not like 'Log';`;
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