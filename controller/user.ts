import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { encryptPassword, validatePassword} from "../helpers/password";
import { saveLog } from "./log";

const prisma = new PrismaClient();
export const getAllUsers = async(req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) | 1;
        const pageSize = parseInt(req.query.pageSize as string) | 10;
        const skip = (page - 1) * pageSize;

        const users = await prisma.user.findMany({
            where: {active : 1},
            include: { roles: true },
            skip,
            take: pageSize
        });
        res.json({
            msg: 'ok',
            error: false,
            records: users.length,
            page,
            data: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting users',
            error
        });
    }
}

export const getUserById = async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const idNumber = parseInt(id, 10);
        if (!id || isNaN(idNumber)) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        
        const existingUser = await prisma.user.findFirst({
            where: {id: idNumber},
            include: { roles: true }});
        
        if(!existingUser)
            res.status(404).json({msg: 'User not found', error: false, data:[]});
        else{
            res.json({
                msg: 'ok',
                error: false,
                records: 1,
                data: existingUser
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting user',
            error: error,
            data: []

        });
    }
}

export const getUserByUsername = async(req: Request, res: Response) => {
    try {
        const {username} = req.body;
        if (!username) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        
        const existingUser = await prisma.user.findFirst({
            where: {username},
            include: { roles: true }});
        
        if(!existingUser){
            if(req.originalUrl.includes('forgotPassword')) await saveLog('BD', 'AUDIT', req.originalUrl, `Forgot Password`, `User not found: ${username}`, '', req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'ERROR');
            res.status(404).json({msg: 'User not found', error: false, data:[]});
        }
        else{
            if(req.originalUrl.includes('forgotPassword')) await saveLog('BD', 'AUDIT', req.originalUrl, `Forgot Password`, 'Getting user successfully', username, req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'INFO');
            res.json({
                msg: 'ok',
                error: false,
                records: 1,
                data: existingUser
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting user',
            error: error,
            data: []

        });
    }
}

export const saveUser = async(req: Request, res: Response) => {
    try {
        const {username, password, email, profileId, roleId} = req.body; 
        const encryptedPassword = await encryptPassword(password);

        const existingUser = await prisma.user.findUnique({
            where: { username },
            include: { roles: true }
        });
        if (existingUser) {
            const existingRole = existingUser.roles.find((role: { roleId: number }) => role.roleId === roleId);
            /* Confirmar la necesidad de esta validacion
            const matchPasswords = await validatePassword(password, existingUser.password);
            if(matchPasswords){
                return res.status(400).json({ msg: 'New password cannot be the same as old one', error: true, data: [] });
            } /* */

            if (existingRole) {
                const updatedUser = await prisma.user.update({
                    where: { username },
                    data: {
                        password: encryptedPassword,
                        email,
                        profileId,
                        active: 1
                    }
                });

                res.json({
                    updatedUser,
                    msg: `User ${updatedUser.username} updated with existing role`
                });
            } 
            else {
                const updatedUser = await prisma.user.update({
                    where: { username },
                    data: {
                        password: encryptedPassword,
                        email,
                        profileId,
                        active: 1,
                        roles: {
                            create: [
                                {
                                    roleId
                                }
                            ]
                        }
                    }
                });

                res.json({
                    updatedUser,
                    msg: `User ${updatedUser.username} updated and new role assigned`
                });
            }
        } 
        else {
            const newUser = await prisma.user.create({
                data: {
                    username,
                    password: encryptedPassword,
                    email,
                    profileId,
                    roles: {
                        create: [
                            {
                                roleId
                            }
                        ]
                    }
                }
            });

            res.json({
                newUser,
                msg: `User ${newUser.username} created`
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        });
    }
}

export const updateUserById = async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const idNumber = parseInt(id, 10);
        const {username, password, email, profileId, roleId} = req.body;
        const encryptedPassword = await encryptPassword(password);;
        if (!id || isNaN(idNumber)) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        
        const existingUser = await prisma.user.findFirst({
            where: {id: idNumber},
            include: { roles: true }
        });
        
        if(!existingUser)
            res.status(404).json({msg: 'User not found', error: false, data:[]});

        /* Confirmar la necesidad de esta validacion
        const matchPasswords = await validatePassword(password, existingUser.password);
        if(matchPasswords){
            return res.status(400).json({ msg: 'New password cannot be the same as old one', error: true, data: [] });
        } /* */

        const existingRole = existingUser.roles.find((role: { roleId: number }) => role.roleId === roleId);
        if (existingRole) {
            const updatedUser = await prisma.user.update({
                where: {
                    id: idNumber
                },
                data: {
                    username, 
                    password: encryptedPassword, 
                    email, 
                    profileId
                }
            });

            res.status(200).json({
                updatedUser,
                msg: `User ${username} updated with existing role`,
                error: false,
                records: 1
            });
        }
        else{
            const updatedUser = await prisma.user.update({
                where: {
                    id: idNumber
                },
                data: {
                    username, 
                    password: encryptedPassword, 
                    email, 
                    profileId,
                    roles: {
                        create: [
                            {
                                roleId
                            }
                        ]
                    }
                }
            });
            res.status(200).json({
                updatedUser,
                msg: `User ${username} updated and new role assigned`,
                error: false,
                records: 1
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        });
    }
}

export const deleteUserById = async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const idNumber = parseInt(id, 10);
        if (!id || isNaN(idNumber)) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });

        await prisma.user.update({
            where: {
                id: idNumber
            },
            data: {
                active: 0
            }
        });
        
        res.status(200).json({
            msg: `User ${id} deleted`,
            error: false
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error
        });
    }
}