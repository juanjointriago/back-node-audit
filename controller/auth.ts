import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateJWT } from "../helpers/generate-jwt";
import { encryptPassword, validatePassword } from "../helpers/password";
import { sendEmail } from "./mail";
import {saveLog} from "./log";

const prisma = new PrismaClient();
export const login = async(req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        let generatedToken;
        let validPassword = false;
        if (!username || !password) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        
        const existingUser = await prisma.user.findFirst({where: {username: username, active: 1}});
        
        if (!existingUser) res.status(404).json({ msg: 'User not found', error: true, data: [] });
        
        validPassword = await validatePassword(password, existingUser.password);
        
        if(!validPassword){
            const defaultEmails = await prisma.param.findUnique({where: { key: 'DEFAULT_EMAILS' }}) || '';
            const defaultTextEmail = await prisma.param.findUnique({where: { key: 'DEFAULT_TEXT_EMAIL' }});
            const defaultHtmlEmail = await prisma.param.findUnique({where: { key: 'DEFAULT_HTML_EMAIL' }});
            const body = JSON.stringify(req.body);
            const log = await saveLog('User', 'Audit', req.originalUrl, `Login attempt for username: ${username}`, body, username, req.ip || '', 'Web', process.env.VERSION || '');
            //sendEmail(process.env.EMAIL || '', defaultEmails?.value, defaultTextEmail.value, defaultHtmlEmail?.value, 'Login Failed!','Info');
            return res.status(404).json({msg: 'Invalid User/Password', error: false, data:log});
        }
            
      
        generatedToken = await generateJWT(existingUser.id);
        res.json({
            msg: 'ok',
            error: false,
            records: 1,
            data: existingUser,
            token: generatedToken || ''
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting user',
            error: error,
            data: []

        });
    }
}

export const resetPassword = async(req: Request, res: Response) => {
    try {
        const {id, password, confirmPassword} = req.body;
        if (!(id || password || confirmPassword)) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });

        const existingUser = await prisma.user.findFirst({where: {id, active: 1}});

        if (!existingUser) res.status(404).json({ msg: 'User not found', error: true, data: [] });

        const encryptedPassword = await encryptPassword(password);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                password: encryptedPassword
            }
        });

        res.json({
            msg: `Username: ${updatedUser.username} -> Password changed successfully`,
            error: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error getting user',
            error: error,
            data: []

        });
    }
}

