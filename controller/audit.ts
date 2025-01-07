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