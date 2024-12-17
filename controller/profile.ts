import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"
import { validationResult } from "express-validator";

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
        const {id} = req.params;
        const idNumber = parseInt(id, 10);
        if (!id || isNaN(idNumber)) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        
        const existingProfile = await prisma.profile.findFirst({where: {id: idNumber}});
        
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
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors});
        
        const {name, description} = req.body;
        const newProfile = await prisma.profile.upsert({
            create: {name, description},
            update: {name, description},
            where: {name}
            })
        res.json({
            newProfile,
            msg: `Profile ${newProfile.name} created`
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
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors});

        const {id} = req.params;
        const idNumber = parseInt(id, 10);
        const {name, description} = req.body;
        if (!id || isNaN(idNumber)) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        const updatingProfile = await prisma.profile.findFirst({where: {id: idNumber}});
        if(!updatingProfile)
            res.status(404).json({msg: 'Profile not found', error: false, data:[]})
        
        await prisma.profile.update({
            where: {
                id: idNumber
            },
            data: {
                name, description
            }
            });
        res.status(200).json({
            msg: `Profile ${name} updated`,
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
        const {id} = req.params;
        const idNumber = parseInt(id, 10);
        if (!id || isNaN(idNumber)) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });

        await prisma.profile.update({
            where: {
                id: idNumber
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