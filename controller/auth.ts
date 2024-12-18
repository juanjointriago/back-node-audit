import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateJWT } from "../helpers/generate-jwt";
import { validatePassword } from "../helpers/password";
import { sendEmail } from "./mail";

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
            const defaultEmail = await prisma.param.findUnique({where: { key: 'DEFAULT_EMAIL' }}) || '';
            const defaultTextEmail = await prisma.param.findUnique({where: { key: 'DEFAULT_TEXT_EMAIL' }});
            const defaultHtmlEmail = await prisma.param.findUnique({where: { key: 'DEFAULT_HTML_EMAIL' }});
            await sendEmail(defaultEmail?.value, defaultEmail?.value, defaultTextEmail.value, defaultHtmlEmail?.value, 'Login Failed!','Info');
            return res.status(404).json({msg: 'Invalid User/Password', error: false, data:[]});
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

