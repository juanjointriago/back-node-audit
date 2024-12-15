import { Request, Response } from "express";
import { nextTick } from "process";

const jwt = require('jsonwebtoken');

export const validateJWT = async(req: Request, res: Response, next: any) => {
    const token = req.header('auth-token');
    console.log(token);
    if(!token){
        res.status(401).json({
            msg: 'Non-Authenticated'
        })
    }
    try {
        jwt.verify(token, process.env.SECRETKEY);
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        }) 
    }
    next();
}

