import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient();

export const getAllRoles = async(req: Request, res: Response) => {
    try {
        const roles = await prisma.role.findMany({where: {active : 1}});
        res.json({
            msg: 'ok',
            error: false,
            records: roles.length,
            data: roles
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting roles',
            error
        })
    }
}

export const getRoleById = async(req: Request, res: Response) => {
    try {
        const {id} = req.body;
        if (!id) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const existingRole = await prisma.role.findFirst({where: {id: id}});
        if(!existingRole)
            res.status(404).json({msg: 'Role not found', error: false, data:[]})
        
        res.json({
            msg: 'ok',
            error: false,
            records: 1,
            data: existingRole
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting role',
            error: error,
            data: []

        })
    }
}

export const saveRole = async(req: Request, res: Response) => {
    try {
        const {name, description} = req.body;
        const newRole = await prisma.role.create({data: {name, description}});
        res.json({
            newRole,
            msg: `Role ${newRole.id} created`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong',
            error
        })
    }
}

export const updateRoleById = async(req: Request, res: Response) => {
    try {
        const {id, name, description} = req.body;
        if (!id) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const updatingRole = await prisma.role.findFirst({where: {id: id}});
        if(!updatingRole)
            res.status(404).json({msg: 'Role not found', error: false, data:[]})
        
        await prisma.role.update({
            where: {
                id: id
            },
            data: {
                name, description
            }
            });
        res.status(200).json({
            msg: `Role ${id} updated`,
            error: false,
            records: 1
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        })
    }
}

export const deleteRoleById = async(req: Request, res: Response) => {
    try {
        const {id} = req.body;
        if (!id) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });

        await prisma.role.update({
            where: {
                id: id
            },
            data: {
                active: 0
            }
            });

        res.status(200).json({
            msg: `Role ${id} deleted`,
            error: false
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        })
    }
}