import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"

const prisma = new PrismaClient();

export const getAllProfiles = async(req: Request, res: Response) => {
    try {
        const profiles = await prisma.profile.findMany({where: {active : 1}});
        res.json({
            msg: 'ok',
            error: false,
            records: profiles.length,
            data: profiles
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting profiles',
            error
        })
    }
}

export const getProfileById = async(req: Request, res: Response) => {
    try {
        const {id} = req.body;
        if (!id) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const existingProfile = await prisma.profile.findFirst({where: {id: id}});
        if(!existingProfile)
            res.status(404).json({msg: 'Profile not found', error: false, data:[]})
    
        res.json({
            msg: 'ok',
            error: false,
            records: 1,
            data: existingProfile
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting profile',
            error: error,
            data: []

        })
    }
}

export const saveProfile = async(req: Request, res: Response) => {
    try {
        const {name, description} = req.body;
        const newProfile = await prisma.profile.create({data: {name, description}});
        res.json({
            newProfile,
            msg: `Profile ${newProfile.id} created`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong',
            error
        })
    }
}

export const updateProfileById = async(req: Request, res: Response) => {
    try {
        const {id, name, description} = req.body;
        if (!id) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const updatingProfile = await prisma.profile.findFirst({where: {id: id}});
        if(!updatingProfile)
            res.status(404).json({msg: 'Profile not found', error: false, data:[]})
        
        await prisma.profile.update({
            where: {
                id: id
            },
            data: {
                name, description
            }
            });
        res.status(200).json({
            msg: `Profile ${id} updated`,
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

export const deleteProfileById = async(req: Request, res: Response) => {
    try {
        const {id} = req.body;
        if (!id) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });

        await prisma.profile.update({
            where: {
                id: id
            },
            data: {
                active: 0
            }
            });

        res.status(200).json({
            msg: `Profile ${id} deleted`,
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