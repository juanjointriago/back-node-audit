import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getLogs = async(req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const skip = (page - 1) * pageSize;

        const logs = await prisma.log.findMany({
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
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting logs',
            error
        });
    }
}

export const saveLog = async(
    entity: String,
    type: String,
    action: String,
    short_msg: String,
    long_msg: String,
    user: String,
    ip: String,
    program: String,
    version: String
) => {
    try {
        const newLog = await prisma.log.create({
            data:{
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
    } catch (error) {
        console.warn(error);
    }
}