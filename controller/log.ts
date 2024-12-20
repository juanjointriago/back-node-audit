import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getLogs = async(req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) | 1;
        const pageSize = parseInt(req.query.pageSize as string) | 100;
        const skip = (page - 1) * pageSize;

        //Filters(optional)
        const entity = req.query.entity as string | undefined;
        const type = req.query.type as string | undefined;
        const action = req.query.action as string | undefined;
        const user = req.query.user as string | undefined;
        const program = req.query.program as string | undefined;
        const dateStart = req.query.dateStart as string | undefined;
        const dateEnd = req.query.dateEnd as string | undefined;

        const where: any = {};

        if (entity) where.entity = entity;
        if (type) where.type = type;
        if (action) where.action = action;
        if (user) where.user = user;
        if (program) where.program = program;
        if(dateStart || dateEnd){
            where.createdAt = {};
            if(dateStart) where.createdAt.gte = new Date(dateStart);
            if(dateEnd) where.createdAt.lte = new Date(dateEnd);
        }


        const logs = await prisma.log.findMany({
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