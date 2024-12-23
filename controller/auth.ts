import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateJWT } from "../helpers/generate-jwt";
import { encryptPassword, validatePassword } from "../helpers/password";
import { sendEmail } from "./mail";
import { saveLog } from "./log";

const prisma = new PrismaClient();
export const login = async(req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        let generatedToken;
        let validPassword = false;
        if (!username || !password) res.status(400).json({ msg: 'Bad request', error: true, records: 0, data: [] });
        
        const existingUser = await prisma.user.findFirst({where: {username: username, active: 1}});
        
        if (!existingUser){
            await saveLog('BD', 'AUDIT', req.originalUrl, `Login attempt failed`, 'User not found', username, req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'ERROR');
            return res.status(404).json({ 
                msg: 'User not found', 
                error: true, 
                data: [] 
            });
        }
        
        validPassword = await validatePassword(password, existingUser.password);
        if(!validPassword){
            const defaultEmails = await prisma.param.findUnique({where: { key: 'DEFAULT_EMAILS' }}) || '';
            const defaultTextEmail = await prisma.param.findUnique({where: { key: 'DEFAULT_TEXT_EMAIL' }});
            const defaultHtmlEmail = await prisma.param.findUnique({where: { key: 'DEFAULT_HTML_EMAIL' }});
            await saveLog('BD', 'AUDIT', req.originalUrl, `Login attempt failed`, /*JSON.stringify(req.body)*/ 'Invalid Password', username, req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'ERROR');
            if(!defaultEmails)
                sendEmail(process.env.EMAIL || '', defaultEmails?.value, defaultTextEmail.value, defaultHtmlEmail?.value, 'Login Failed!','Info');
            
            return res.status(404).json({msg: 'Invalid Password', error: false, data:log});
        }
            
        
        generatedToken = await generateJWT(existingUser.id);
        await saveLog('BD', 'AUDIT', req.originalUrl, `Login success`, JSON.stringify({token: generatedToken}), username, req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'INFO');
        return res.json({
            msg: 'ok',
            error: false,
            records: 1,
            data: existingUser,
            token: generatedToken || ''
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
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

        if (!existingUser){
            await saveLog('BD', 'AUDIT', req.originalUrl, `Reset password failed`, `User not found: ${id}`, '', req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'ERROR');
            return res.status(404).json({ msg: 'User not found', error: true, data: [] });   
        }

        const matchPasswords = await validatePassword(password, existingUser.password);
        if(matchPasswords){
            await saveLog('BD', 'AUDIT', req.originalUrl, `Reset password failed`, `New password cannot be the same as the old one`, existingUser.username, req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'ERROR');
            return res.status(400).json({ msg: 'New password cannot be the same as the old one', error: true, data: [] });
        }

        const encryptedPassword = await encryptPassword(password);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                password: encryptedPassword
            }
        });
        
        await saveLog('BD', 'AUDIT', req.originalUrl, `Reset password success`, JSON.stringify({password: encryptedPassword}), updatedUser.username, req.ip || '', process.env.APPNAME || '', process.env.VERSION || 'INFO');

        res.json({
            msg: `Username: ${updatedUser.username} -> Password changed successfully`,
            error: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Somenthing went wrong',
            error: error,
            data: []

        });
    }
}

