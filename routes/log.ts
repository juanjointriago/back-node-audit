import { Router } from "express";
import {getLogs} from "../controller/log";
import { validateJWT } from "../middlewares/validate-jwt";
const router = Router();

router.get('/', 
    validateJWT,
    getLogs);

export default router;